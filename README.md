<!-- FREE WA WEB | Modern WhatsApp Web Clone -->

<p align="center">
  <img src="https://files.catbox.moe/f9gwsx.jpg" alt="FREE SC WA WEB Banner" width="100%">
</p>

<h1 align="center">Hi 👋, I'm Malvin King</h1>
<h3 align="center">💻 Passionate Developer | Exploring the Boundless World of Technology 🌍</h3>

<p align="center">
  <a href="https://wa.me/263780958186" target="_blank">
    <img src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/whatsapp.svg" alt="WhatsApp" height="30" width="30">
    <strong> FREE WA WEB</strong>
  </a>
</p>

<p align="center">
  <img src="https://komarev.com/ghpvc/?username=XdKing2&label=Profile%20views&color=0e75b6&style=flat" alt="XdKing2" />
</p>

---

## ✨ Features

### 🔐 Pairing System
- **Easy QR-less pairing** - Just enter your phone number
- **Secure pairing codes** - Get instant pairing codes
- **Auto-redirect** - Automatically redirects to WhatsApp Web after pairing

### 💬 WhatsApp Web Interface
- **Full WhatsApp Web clone** - Looks and feels like the real thing
- **Real-time messaging** - Send and receive messages instantly
- **Chat management** - View all your chats, contacts, and groups
- **Group features** - Create groups, add members, manage admins
- **Search functionality** - Search through chats and messages
- **Contact management** - View contact info and chat details
- **Notifications** - Get real-time notifications for new messages
- **Responsive design** - Works perfectly on desktop and mobile

### 🎨 UI Features
- Dark theme matching WhatsApp
- Smooth animations and transitions
- Message status indicators (sent, delivered, read)
- Typing indicators
- Online/offline status
- Profile pictures and avatars
- Emoji support
- Media attachment buttons
- Message timestamps

### 🛠️ Advanced Features
- **Refresh** - Reload chats without losing connection
- **Logout** - Securely disconnect from session
- **Link new device** - Return to pairing screen
- **Group creation** - Create new groups with selected contacts
- **Group management** - Add/remove members, edit group info
- **Chat controls** - Mute, clear, or delete chats
- **Session persistence** - Stay logged in across browser sessions

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- WhatsApp account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/XdKing2/free-sc-mini.git
cd free-sc-mini
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the server**
```bash
npm start
```

4. **Open your browser**
```
http://localhost:8000
```

---

## 📱 How to Use

### Step 1: Pair Your Device
1. Open `http://localhost:8000` in your browser
2. Enter your WhatsApp number with country code (e.g., 263714757857)
3. Click "Submit" to generate your pairing code
4. Open WhatsApp on your phone
5. Go to Settings → Linked Devices → Link a Device
6. Select "Link with phone number instead"
7. Enter the 8-digit pairing code shown on the web page
8. Wait for automatic redirect to WhatsApp Web

### Step 2: Use WhatsApp Web
Once paired, you'll be redirected to the WhatsApp Web interface where you can:

- **View all chats** - See all your conversations in the sidebar
- **Send messages** - Click any chat and start typing
- **Search** - Use the search bar to find chats and messages
- **Create groups** - Click the groups icon to create new groups
- **Manage chats** - Right-click or use the menu for chat options
- **View contact info** - Click chat header to see details
- **Logout** - Use the menu to disconnect safely
- **Refresh** - Reload chats without losing connection

---

## 🌐 Deploy

### Heroku
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/XdKing2/free-sc-mini)

### Other Platforms
- **Railway** - Easy deployment with automatic SSL
- **Render** - Free tier available
- **DigitalOcean** - VPS deployment
- **AWS** - EC2 instance
- **Self-hosted** - Your own server

---

## 🎯 Routes

- `/` - Main pairing page
- `/web` - WhatsApp Web interface (after pairing)
- `/code` - API endpoint for pairing code generation
- `/pair` - Alternative pairing page

---

## 🔧 Configuration

Edit `config.js` to customize:

```javascript
module.exports = {
    AUTO_VIEW_STATUS: 'true',
    AUTO_LIKE_STATUS: 'true',
    AUTO_RECORDING: 'true',
    PREFIX: '.',
    BOT_NAME: 'ғʀᴇᴇ-ᴍɪɴɪ',
    OWNER_NAME: 'ᴍʀ xᴅᴋɪɴɢ',
    OWNER_NUMBER: '263714757857',
    // ... more options
};
```

---

## 🛡️ Security Features

- End-to-end encryption (via WhatsApp)
- Secure session management
- No message storage on server
- Automatic session cleanup
- HTTPS ready for production

---

## 📸 Screenshots

### Pairing Page
Beautiful dark-themed pairing interface with animated effects

### WhatsApp Web Interface
Full-featured WhatsApp Web clone with:
- Chat list with search
- Message view with typing indicators
- Contact and group info panels
- Create group modal
- Responsive design

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

**Malvin King (XdKing2)**

- GitHub: [@XdKing2](https://github.com/XdKing2)
- WhatsApp Channel: [Join Channel](https://whatsapp.com/channel/0029VbB3YxTDJ6H15SKoBv3S)
- Email: malvintech@example.com

---

## 💬 Support

For support, join our [WhatsApp Channel](https://whatsapp.com/channel/0029VbB3YxTDJ6H15SKoBv3S) or open an issue on GitHub.

### Common Issues

**Q: The pairing code doesn't work**
A: Make sure you enter the code within 1 minute of generation. If expired, click "Clear" and generate a new one.

**Q: Can't see messages in web interface**
A: Make sure your phone has internet connection. WhatsApp Web requires your phone to be online.

**Q: Disconnected from server**
A: Click "Refresh" in the menu to reconnect, or logout and pair again.

**Q: How to logout?**
A: Click the three dots in the sidebar header → Logout

---

## 🌟 Features Comparison

| Feature | Free SC Mini | WhatsApp Web | Telegram Web |
|---------|--------------|--------------|--------------|
| No QR Code | ✅ | ❌ | ❌ |
| Phone Number Pairing | ✅ | ❌ | ✅ |
| Auto-redirect | ✅ | ❌ | ❌ |
| Group Management | ✅ | ✅ | ✅ |
| Real-time Sync | ✅ | ✅ | ✅ |
| Dark Theme | ✅ | ✅ | ✅ |
| Open Source | ✅ | ❌ | ✅ |

---

## 🔮 Roadmap

- [ ] Voice and video call support
- [ ] Media file uploads (images, videos, documents)
- [ ] Status/Stories viewing
- [ ] Message reactions
- [ ] Sticker support
- [ ] Voice messages
- [ ] Location sharing
- [ ] Contact sharing
- [ ] Multi-device support
- [ ] Desktop app (Electron)

---

## ⚠️ Disclaimer

This is not an official WhatsApp product. Use at your own risk. The developers are not responsible for any misuse of this software.

This project is for educational purposes only. Make sure to comply with WhatsApp's Terms of Service.

---

<div align="center">

**© 2025 Free Mini. Powered by Malvin Tech. All rights reserved.**

Made with ❤️ by Malvin King

### ⭐ If you like this project, please give it a star!

</div>

---

⭐ **Thank you for visiting my profile!** 🙌  
*Keep learning, keep building, and keep growing 🚀*
