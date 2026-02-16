const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

__path = process.cwd()
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8000;
let code = require('./pair'); 

require('events').EventEmitter.defaultMaxListeners = 500;

// Store active sessions
const activeSessions = new Map();

app.use('/code', code);
app.use('/pair', async (req, res, next) => {
    res.sendFile(__path + '/pair.html')
});
app.use('/web', async (req, res, next) => {
    res.sendFile(__path + '/web.html')
});
app.use('/', async (req, res, next) => {
    res.sendFile(__path + '/main.html')
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    const sessionId = socket.handshake.query.session;
    
    if (sessionId) {
        activeSessions.set(sessionId, socket);
        console.log('Session linked:', sessionId);
    }

    // Get chats
    socket.on('get_chats', (callback) => {
        // This will be populated by the WhatsApp connection
        const chats = socket.whatsappChats || [];
        callback({ success: true, chats });
    });

    // Get messages
    socket.on('get_messages', (data, callback) => {
        // This will be populated by the WhatsApp connection
        const messages = socket.whatsappMessages?.[data.chatId] || [];
        callback({ success: true, messages });
    });

    // Send message
    socket.on('send_message', (data, callback) => {
        // This will be handled by the WhatsApp connection
        console.log('Send message:', data);
        
        // Emit to WhatsApp handler
        socket.emit('whatsapp_send', data);
        
        callback({ success: true });
    });

    // Logout
    socket.on('logout', () => {
        if (sessionId) {
            activeSessions.delete(sessionId);
        }
        socket.disconnect();
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        if (sessionId) {
            activeSessions.delete(sessionId);
        }
    });
});

// Export for use in pair.js
app.io = io;
app.activeSessions = activeSessions;

server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════╗
║   FREE SC MINI - WhatsApp Web Bot    ║
║   Don't Forget To Give Star ⭐       ║
╚══════════════════════════════════════╝

Server running on http://localhost:${PORT}

Available routes:
  / - Main pairing page
  /web - WhatsApp Web interface
  /code - API endpoint for pairing codes
`)
});

module.exports = app;
