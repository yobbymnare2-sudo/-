const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const router = express.Router();
const pino = require('pino');
const moment = require('moment-timezone');
const { MongoClient } = require('mongodb');

const {
  default: makeWASocket,
  useMultiFileAuthState,
  delay,
  makeCacheableSignalKeyStore,
  Browsers,
  jidNormalizedUser,
  DisconnectReason
} = require('baileys');

// --- CONFIG ---
const config = require('./config');

// --- MONGO & STORAGE HELPERS ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://malvintech11_db_user:0SBgxRy7WsQZ1KTq@cluster0.xqgaovj.mongodb.net/?appName=Cluster0';
const MONGO_DB = process.env.MONGO_DB || 'Free_Mini';

let mongoClient, mongoDB, sessionsCol;
const activeSockets = new Map();

async function initMongo() {
  try {
    if (mongoClient && mongoClient.topology && mongoClient.topology.isConnected && mongoClient.topology.isConnected()) return;
  } catch(e){}
  mongoClient = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await mongoClient.connect();
  mongoDB = mongoClient.db(MONGO_DB);
  sessionsCol = mongoDB.collection('sessions');
  console.log('✅ Mongo initialized');
}

async function saveCredsToMongo(number, creds) {
  try {
    await initMongo();
    const sanitized = number.replace(/[^0-9]/g, '');
    await sessionsCol.updateOne({ number: sanitized }, { $set: { number: sanitized, creds, updatedAt: new Date() } }, { upsert: true });
  } catch (e) { console.error('Mongo Save Error:', e); }
}

async function loadCredsFromMongo(number) {
  try {
    await initMongo();
    const sanitized = number.replace(/[^0-9]/g, '');
    return await sessionsCol.findOne({ number: sanitized });
  } catch (e) { return null; }
}

async function removeSessionFromMongo(number) {
  try {
    await initMongo();
    const sanitized = number.replace(/[^0-9]/g, '');
    await sessionsCol.deleteOne({ number: sanitized });
    const sessionPath = path.join(os.tmpdir(), `session_${sanitized}`);
    if (fs.existsSync(sessionPath)) fs.removeSync(sessionPath);
  } catch (e) { console.error('Mongo Remove Error:', e); }
}

// --- CORE SESSION LOGIC ---
async function startSession(number, res, isReconnect = false) {
  const sanitizedNumber = number.replace(/[^0-9]/g, '');
  const sessionPath = path.join(os.tmpdir(), `session_${sanitizedNumber}`);

  // Load existing session
  try {
    const mongoDoc = await loadCredsFromMongo(sanitizedNumber);
    if (mongoDoc && mongoDoc.creds) {
      fs.ensureDirSync(sessionPath);
      fs.writeFileSync(path.join(sessionPath, 'creds.json'), JSON.stringify(mongoDoc.creds, null, 2));
    }
  } catch (e) { console.warn('Could not prefill creds', e); }

  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
  const logger = pino({ level: 'fatal' });

  try {
    const socket = makeWASocket({
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, logger) },
      printQRInTerminal: false,
      logger,
      browser: Browsers.macOS('Safari')
    });

    // Save creds on update
    socket.ev.on('creds.update', async () => {
      try {
        await saveCreds();
        const fileContent = await fs.readFile(path.join(sessionPath, 'creds.json'), 'utf8');
        const credsObj = JSON.parse(fileContent);
        await saveCredsToMongo(sanitizedNumber, credsObj);
      } catch (err) { console.error('Failed saving creds', err); }
    });

    // Handle Connection Updates
    socket.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;
      
      if (connection === 'open') {
        console.log(`✅ Session ${sanitizedNumber} connected`);
        activeSockets.set(sanitizedNumber, socket);
      }

      if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        if (statusCode === 401) {
           console.log(`Session ${sanitizedNumber} logged out.`);
           await removeSessionFromMongo(sanitizedNumber);
        }
        activeSockets.delete(sanitizedNumber);
      }
    });

    // PAIRING CODE LOGIC
    if (!socket.authState.creds.registered) {
      let code;
      try {
        await delay(1500);
        code = await socket.requestPairingCode(sanitizedNumber);
      } catch (e) {
        console.error("Pairing Error", e);
      }
      
      if (!res.headersSent) {
        return res.send({ status: 'pairing', code: code });
      }
    } else {
      activeSockets.set(sanitizedNumber, socket);
      if (!res.headersSent) {
        return res.send({ status: 'connected' });
      }
    }

  } catch (error) {
    console.error('Socket Error:', error);
    if (!res.headersSent) res.status(500).send({ error: 'Failed to start session' });
  }
}

// --- ROUTER ENDPOINTS ---

// 1. Start Pairing
router.get('/', async (req, res) => {
  const { number } = req.query;
  if (!number) return res.status(400).send({ error: 'Number required' });
  await startSession(number, res);
});

// 2. Check Status
router.get('/check', async (req, res) => {
  const { number } = req.query;
  const sanitized = number.replace(/[^0-9]/g, '');
  if (activeSockets.has(sanitized)) {
    return res.send({ connected: true });
  }
  res.send({ connected: false });
});

// 3. Get User Info
router.get('/me', async (req, res) => {
  const { number } = req.query;
  const sanitized = number.replace(/[^0-9]/g, '');
  
  if (activeSockets.has(sanitized)) {
    const sock = activeSockets.get(sanitized);
    const user = sock.user || {};
    const ppUrl = await sock.profilePictureUrl(user.id, 'image').catch(() => 'https://files.catbox.moe/f9gwsx.jpg');
    
    return res.send({
      name: user.name || user.notify || 'User',
      number: user.id ? user.id.split(':')[0] : sanitized,
      picture: ppUrl
    });
  }
  res.status(404).send({ error: 'Not connected' });
});

// 4. Get Groups
router.get('/get-groups', async (req, res) => {
  const { number } = req.query;
  const sanitized = number.replace(/[^0-9]/g, '');
  
  if (activeSockets.has(sanitized)) {
    const sock = activeSockets.get(sanitized);
    try {
      const groups = await sock.groupFetchAllParticipating();
      const formatted = Object.values(groups).map(g => ({
        id: g.id,
        name: g.subject,
        size: g.participants.length,
        creation: g.creation
      }));
      res.send({ status: 'success', groups: formatted });
    } catch(e) {
      res.status(500).send({ error: 'Failed to fetch groups' });
    }
  } else {
    res.status(400).send({ error: 'Not connected' });
  }
});

// 5. Group Action (Add Admin, Add Member, Leave)
router.post('/group-action', async (req, res) => {
  const { number, action, groupId, targetNumbers } = req.body;
  const sanitized = number.replace(/[^0-9]/g, '');
  
  if (!activeSockets.has(sanitized)) {
    return res.status(400).send({ error: 'Not connected' });
  }

  const sock = activeSockets.get(sanitized);
  
  try {
    // Format numbers to JID
    const jids = targetNumbers.map(n => n.replace(/[^0-9]/g, '') + '@s.whatsapp.net');

    if (action === 'promote') {
      await sock.groupParticipantsUpdate(groupId, jids, 'promote');
      res.send({ status: 'success', message: 'Promoted to admin' });
    } 
    else if (action === 'add') {
      // Note: Adding members often fails if privacy settings are strict
      const result = await sock.groupParticipantsUpdate(groupId, jids, 'add');
      res.send({ status: 'success', result });
    } 
    else if (action === 'leave') {
      await sock.groupLeave(groupId);
      res.send({ status: 'success', message: 'Left the group' });
    } 
    else {
      res.status(400).send({ error: 'Invalid action' });
    }
  } catch (e) {
    console.error('Group Action Error:', e);
    res.status(500).send({ error: e.message || 'Action failed' });
  }
});

module.exports = router;
