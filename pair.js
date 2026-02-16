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

  // Load existing session from Mongo
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
        
        // If this was a fresh pairing, send a welcome message
        const userJid = jidNormalizedUser(socket.user.id);
        await socket.sendMessage(userJid, { text: '✅ Connection Successful! Your WhatsApp Web session is now active.' });
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
      // Already registered
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

// 2. Check Status (Polling from Frontend)
router.get('/check', async (req, res) => {
  const { number } = req.query;
  const sanitized = number.replace(/[^0-9]/g, '');
  
  // Check if socket is active
  if (activeSockets.has(sanitized)) {
    const sock = activeSockets.get(sanitized);
    const user = sock.user || {};
    return res.send({ 
      connected: true, 
      name: user.name || user.notify || 'User',
      number: user.id ? user.id.split(':')[0] : sanitized
    });
  }
  
  // Check if we have creds in DB but socket is currently down (try to reconnect)
  const creds = await loadCredsFromMongo(sanitized);
  if (creds) {
     // Trigger reconnection in background
     startSession(sanitized, { headersSent: true, send:()=>{} }, true);
     return res.send({ connected: false, hasSession: true });
  }

  res.send({ connected: false });
});

// 3. Get User Info (for Dashboard Header)
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

module.exports = router;
