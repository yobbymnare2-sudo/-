# 🚀 Quick Start Guide

## Get Started in 3 Minutes!

### Step 1: Install (30 seconds)
```bash
npm install
```

### Step 2: Start Server (10 seconds)
```bash
npm start
```

### Step 3: Open Browser (5 seconds)
```
http://localhost:8000
```

### Step 4: Pair Your Phone (1 minute)
1. Enter your WhatsApp number (with country code)
2. Click "Submit"
3. Copy the 8-digit code
4. Open WhatsApp → Settings → Linked Devices
5. Link with phone number
6. Enter the code

### Step 5: Use WhatsApp Web! 🎉
- You'll be automatically redirected
- Start chatting immediately!

---

## 📁 File Structure

```
free-sc-mini/
├── index.js          # Main server file
├── pair.js           # Pairing logic
├── web.html          # WhatsApp Web UI
├── main.html         # Pairing page
├── config.js         # Configuration
├── msg.js            # Message handlers
├── Id.js             # ID generator
├── package.json      # Dependencies
├── README.md         # Full documentation
└── SETUP_GUIDE.md    # Detailed setup
```

---

## 🎯 Key Features

✅ **No QR Code** - Just use your phone number  
✅ **Auto-Redirect** - Goes straight to WhatsApp Web  
✅ **Full Features** - Send/receive messages, groups, contacts  
✅ **Real-time** - Instant message sync  
✅ **Responsive** - Works on all devices  
✅ **Secure** - Session-based authentication  

---

## 🔗 Important URLs

- **Main Page**: `http://localhost:8000/`
- **WhatsApp Web**: `http://localhost:8000/web`
- **API Endpoint**: `http://localhost:8000/code?number=YOUR_NUMBER`

---

## 🆘 Quick Help

**Problem: Port in use?**
```bash
PORT=3000 npm start
```

**Problem: Can't pair?**
- Check your number includes country code
- Code expires in 1 minute - generate new one
- Make sure WhatsApp is updated

**Problem: Not seeing chats?**
- Make sure your phone is online
- Click "Refresh" in the menu
- Check browser console for errors

---

## 📱 Menu Options

### Sidebar Menu (Three dots)
- **Refresh** - Reload all chats
- **Logout** - Disconnect and return to pairing
- **Link New Device** - Pair another device

### Chat Menu (Three dots in chat)
- **Contact Info** - View details
- **Mute Notifications** - Silence chat
- **Clear Chat** - Delete messages
- **Delete Chat** - Remove conversation

---

## 🎨 Customization

Edit `config.js`:
```javascript
BOT_NAME: 'Your Name',
OWNER_NUMBER: 'Your Number',
PREFIX: '.',
// ... more options
```

---

## 🌟 What's Next?

1. ⭐ Star the repo on GitHub
2. 📢 Join our WhatsApp Channel
3. 🚀 Deploy to Heroku/Railway
4. 💡 Customize and enjoy!

---

<div align="center">

**Ready to go!** 🎉

Need more help? Check [SETUP_GUIDE.md](SETUP_GUIDE.md)

Made with ❤️ by Malvin King

</div>
