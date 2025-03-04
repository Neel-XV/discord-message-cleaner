# Discord Message Cleaner

> A secure Chrome extension that helps you easily delete your message history from Discord channels.

<div align="center">
  <img src="https://github.com/Neel-XV/discord-message-cleaner/raw/main/icons/icon128.png" alt="Discord Message Cleaner Logo" width="128">
</div>

## 🌟 Features

- **🔍 Selective Deletion** - Delete only your messages from any Discord channel
- **⏱️ Adjustable Speed** - Control the deletion speed to avoid Discord rate limits
- **🔒 Secure Token Storage** - Your Discord token is encrypted locally
- **📦 Batch Processing** - Configurable batch size for efficient message deletion
- **✨ Clean UI** - Modern Discord-style interface
- **📊 Real-time Status** - Live updates on deletion progress

---

## 📋 How It Works

The extension connects to Discord's API using your authentication token to fetch and delete your messages from the current channel. It respects Discord's rate limits and provides feedback on the deletion process.

---

## 🔒 Security

| Security Feature | Description |
|------------------|-------------|
| Token Protection | Your Discord token is **never** sent to any server other than Discord's official API |
| Local Encryption | Optional encryption of your token when stored locally |
| Client-side Operation | All operations happen within your browser |
| Open Source | Full source code available for audit |

---

## 🚀 Installation Guide

1. **Download the extension files**:
   ```bash
   git clone https://github.com/Neel-XV/discord-message-cleaner.git
   ```
   *OR download the ZIP file and extract it to a folder*

2. **Load the extension in Chrome**:
   - Open Chrome/Edge/Brave or any Chromium-based browser
   - Go to `chrome://extensions/` in your address bar
   - Enable "Developer mode" in the top-right corner
   - Click "Load unpacked" and select the folder containing the extension files
   - The extension icon should appear in your browser toolbar



---

## 🔑 How to Get Your Discord Token

To use this extension, you'll need your Discord authentication token:

<details>
<summary><b>Click to expand token retrieval instructions</b></summary>

1. **Open Discord** in your web browser (https://discord.com/app)
2. **Open the browser console** by pressing:
   - `F12` or `Ctrl + Shift + I` (Windows/Linux)
   - `Cmd + Option + I` (Mac)
3. **Go to the Network tab**
4. **Filter the requests** by typing "api" or selecting "Fetch/XHR"
5. **Click on a Discord channel** to generate some network requests
6. **Find a non-error request** (look for a 200 status code)
7. **Click on the request** and go to the "Headers" tab
8. **Find "authorization"** under the "Request Headers" section
9. **Copy the token** (it's a long string of characters)

</details>

> ⚠️ **IMPORTANT SECURITY WARNING**:
> - Your Discord token provides full access to your account
> - NEVER share your token with anyone
> - This extension encrypts your token locally for security
> - Only use this extension on your personal computer

---

## ⚙️ Usage

1. **Click the extension icon** in your browser toolbar
2. **Enter your Discord token** and configure settings:

   | Setting | Recommendation |
   |---------|----------------|
   | Deletion Speed | 1500-2000ms to avoid Discord rate limits |
   | Batch Size | 25-50 messages to process at once |

3. **Navigate to the Discord channel** where you want to delete messages
4. **Click "Start Deletion"**
5. **Monitor progress** in the status area
6. **Click "Stop"** at any time to pause the process

---

## ⚠️ Limitations

- Discord's API has rate limits that may slow down bulk deletions
- Very old messages (typically over 14 days) might require different deletion methods
- The extension needs to be on the specific channel page to delete messages

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Not on Discord" error | Make sure you're on a Discord channel page |
| Slow deletion | Increase the deletion delay to avoid rate limiting |
| Token issues | Ensure your token is correct and that you're logged into Discord |
| No messages deleted | Verify you're in a channel where you've sent messages |

---

## 🛠️ Technical Details

The extension uses:
- Chrome Extension Manifest V3
- Discord API endpoints for fetching and deleting messages
- Web Crypto API for secure token encryption

---

## 📝 License

[MIT License](LICENSE)

---

<div align="center">
  <i>
    <b>Disclaimer</b>: This extension is not affiliated with, endorsed by, or connected to Discord Inc. in any way. Use at your own discretion.
  </i>
</div>