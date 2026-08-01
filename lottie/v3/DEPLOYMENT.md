# Lottie Color Editor - Deployment Guide

This is a **static web application**. It runs entirely in the user's browser (client-side) and does not require a backend logic server (like Node.js or PHP) to function, although it needs to be *served* by a web server.

## 📦 Package Contents

- **index.html**: The main application entry point.
- **preview.html**: The multi-file preview tool.
- **styles.css**: Main stylesheet.
- **js/**: Directory containing application logic.
- **libs/**: External libraries (Lottie web player, GIF encoder).
- **samples/**: Example Lottie files.

## 🚀 How to Deploy

### Option 1: Standard Web Hosting (cPanel, Apache, Nginx)
1.  **Upload**: Upload the entire contents of this zip file to your `public_html` or `www` directory.
2.  **Verify**: Navigate to `your-domain.com` (or `your-domain.com/folder-name`).
3.  **Done!** The app should load immediately.

### Option 2: Static Hosting (Netlify, Vercel, GitHub Pages)
1.  **Drag & Drop**: If using Netlify Drop, simply drag the unzipped folder into their interface.
2.  **Git**: If committing to a repository, ensure the directory structure is preserved.
3.  **Publish Directory**: Set the publish directory to the root of this folder.

## ⚠️ Critical Requirements

1.  **Web Worker (GIF Export)**:
    The GIF export feature uses a "Web Worker" (`libs/gif.worker.js`).
    *   This file **must** be served from the same domain as the application.
    *   Do not host the JS files on a separate CDN unless you configure CORS headers properly.

2.  **HTTPS (Recommended)**:
    Modern browser features (like file system access or clipboard) work best or require HTTPS. Ensure your server has an SSL certificate.

## 🛠 Troubleshooting

*   **"GIF Export stuck at Preparing..."**:
    *   Check your browser console (F12). If you see a "SecurityError" or "Cross-origin" error regarding `gif.worker.js`, ensure that file is reachable and on the same domain.

*   **Changes not appearing?**:
    *   Static files are often cached aggressively by browsers. If you update the tool, try hard-refreshing (Ctrl+F5 or Cmd+Shift+R).

---
*Built for Gamal Eldien*
