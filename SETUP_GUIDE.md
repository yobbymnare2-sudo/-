# 🚀 FREE SC MINI WEB - Setup Guide

## 📋 Table of Contents
1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Running the Application](#running-the-application)
4. [Using WhatsApp Web](#using-whatsapp-web)
5. [Deployment](#deployment)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 Installation

### Local Installation

1. **Clone the Repository**
```bash
git clone https://github.com/XdKing2/free-sc-mini.git
cd free-sc-mini
```

2. **Install Dependencies**
```bash
npm install
```

3. **Verify Installation**
```bash
npm list
```

### System Requirements
- Node.js v18 or higher
- npm v8 or higher
- 1GB RAM minimum
- Internet connection

---

## ⚙️ Configuration

### config.js Settings

Edit `config.js` to customize your setup:

```javascript
module.exports = {
    // Auto features
    AUTO_VIEW_STATUS: 'true',
    AUTO_LIKE_STATUS: 'true',
    AUTO_RECORDING: 'true',
    
    // Bot settings
    PREFIX: '.',
    BOT_NAME: 'ғʀᴇᴇ-ᴍɪɴɪ',
    BOT_VERSION: '1.0.2',
    
    // Owner information
    OWNER_NAME: 'ᴍʀ xᴅᴋɪɴɢ',
    OWNER_NUMBER: '263714757857',
    
    // Links
    GROUP_INVITE_LINK: 'https://chat.whatsapp.com/...',
    CHANNEL_LINK: 'https://whatsapp.com/channel/...',
    
    // Images
    IMAGE_PATH: 'https://files.catbox.moe/f9gwsx.jpg',
    
    // Other settings
    MAX_RETRIES: 3,
    OTP_EXPIRY: 300000, // 5 minutes
};
```

### Environment Variables

Create a `.env` file (optional):
```env
PORT=8000
OWNER_NUMBER=263714757857
MONGO_URI=mongodb://...
```

---

## 🏃 Running the Application

### Development Mode

```bash
npm start
```

The server will start on `http://localhost:8000`

### Production Mode

```bash
NODE_ENV=production npm start
```

### Using PM2 (Recommended for Production)

```bash
# Install PM2
npm install -g pm2

# Start the application
pm2 start index.js --name "whatsapp-web"

# View logs
pm2 logs whatsapp-web

# Stop the application
pm2 stop whatsapp-web

# Restart the application
pm2 restart whatsapp-web
```

---

## 💬 Using WhatsApp Web

### Step 1: Access the Pairing Page

Open your browser and go to:
```
http://localhost:8000
```

### Step 2: Generate Pairing Code

1. Enter your WhatsApp number with country code
   - Example: `263714757857` (Zimbabwe)
   - Example: `1234567890` (USA with +1)
2. Click "Submit"
3. Wait for the 8-digit pairing code to appear

### Step 3: Link on WhatsApp

1. Open WhatsApp on your phone
2. Tap the three dots (menu) → **Linked Devices**
3. Tap **Link a Device**
4. Tap **Link with phone number instead**
5. Enter the country code and phone number
6. Enter the 8-digit pairing code from the web page
7. Wait for confirmation

### Step 4: Automatic Redirect

After successful pairing:
- The page will automatically redirect to `/web`
- You'll see the full WhatsApp Web interface
- Your chats will load automatically

### Step 5: Using the Web Interface

**Sidebar:**
- View all your chats
- Search for chats and contacts
- Access menu (three dots icon):
  - Refresh - Reload chats
  - Logout - Disconnect session
  - Link new device - Return to pairing

**Chat Area:**
- Click any chat to open it
- Send messages by typing and pressing Enter
- View contact/group info by clicking the header
- Access chat menu for more options:
  - Mute notifications
  - Clear chat
  - Delete chat

**Group Features:**
- Click the groups icon to create new groups
- Add participants from your contacts
- Manage group members and admins
- Exit groups

---

## 🌐 Deployment

### Deploy to Heroku

1. **Click the Deploy Button**

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/XdKing2/free-sc-mini)

2. **Or Manual Deployment**

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Deploy
git push heroku main

# Open app
heroku open
```

### Deploy to Railway

1. Fork the repository
2. Go to [Railway](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your forked repository
5. Railway will auto-detect and deploy

### Deploy to Render

1. Go to [Render](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Click "Create Web Service"

### Self-Hosted (VPS)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Clone repository
git clone https://github.com/XdKing2/free-sc-mini.git
cd free-sc-mini

# Install dependencies
npm install

# Install PM2
sudo npm install -g pm2

# Start application
pm2 start index.js --name whatsapp-web

# Setup auto-start on reboot
pm2 startup
pm2 save

# Install Nginx (optional, for reverse proxy)
sudo apt install nginx

# Configure Nginx
sudo nano /etc/nginx/sites-available/whatsapp-web

# Add configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/whatsapp-web /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔍 Troubleshooting

### Common Issues

**Issue: Port already in use**
```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3000 npm start
```

**Issue: Dependencies not installing**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue: Pairing code not working**
- Make sure the code is entered within 1 minute
- Verify your phone number is correct (with country code)
- Check that WhatsApp is updated to the latest version
- Try generating a new code

**Issue: Can't connect to WhatsApp**
- Check your internet connection
- Verify WhatsApp is running on your phone
- Make sure your phone has internet connection
- Try refreshing the page

**Issue: Messages not syncing**
- Click "Refresh" in the menu
- Make sure your phone is online
- Check that WhatsApp isn't force-closed on your phone
- Verify the session is still active

**Issue: Disconnected from server**
- Check server logs: `pm2 logs whatsapp-web`
- Restart the server: `pm2 restart whatsapp-web`
- Check MongoDB connection (if using database)
- Verify network connectivity

### Debug Mode

Enable debug logging:
```javascript
// In index.js, add:
process.env.DEBUG = 'socket.io:*';
```

View logs:
```bash
# With PM2
pm2 logs whatsapp-web

# Without PM2
npm start
```

### Reset Session

If you need to start fresh:
```bash
# Remove session data
rm -rf sessions/

# Clear browser data
# Go to browser settings → Clear browsing data
# Or use Incognito/Private mode

# Restart server
pm2 restart whatsapp-web
```

---

## 📚 Additional Resources

- [WhatsApp Business API Docs](https://developers.facebook.com/docs/whatsapp)
- [Baileys Documentation](https://github.com/WhiskeySockets/Baileys)
- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

---

## 💡 Tips and Best Practices

1. **Security**
   - Don't share your pairing codes
   - Use HTTPS in production
   - Keep dependencies updated
   - Use environment variables for sensitive data

2. **Performance**
   - Use PM2 for process management
   - Enable clustering for high traffic
   - Use Redis for session storage (optional)
   - Implement rate limiting

3. **Maintenance**
   - Monitor server logs regularly
   - Set up error alerts
   - Backup session data
   - Update dependencies monthly

4. **User Experience**
   - Add custom branding
   - Implement analytics
   - Add more features
   - Optimize load times

---

## 🆘 Getting Help

- **GitHub Issues**: [Report bugs or request features](https://github.com/XdKing2/free-sc-mini/issues)
- **WhatsApp Channel**: [Join for updates and support](https://whatsapp.com/channel/0029VbB3YxTDJ6H15SKoBv3S)
- **Email**: malvintech@example.com

---

<div align="center">

**Made with ❤️ by Malvin King**

[GitHub](https://github.com/XdKing2) | [WhatsApp](https://whatsapp.com/channel/0029VbB3YxTDJ6H15SKoBv3S)

</div>
