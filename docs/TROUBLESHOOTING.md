# 🔧 Troubleshooting Guide - Common Issues

## ❌ Error: EADDRINUSE - Port 3000 Already in Use

### Problem
```
Error: listen EADDRINUSE: address already in use :::3000
```

This error means another process is already using port 3000.

### Solution 1: Use the Server Manager Script (Easiest) ⭐

```bash
cd /Users/manas/IdeaProjects/MyDeveloperProfile
./server-manager.sh start
```

The script automatically:
- Kills any process on port 3000
- Starts your server
- Shows status

**Other commands:**
```bash
./server-manager.sh stop      # Stop server
./server-manager.sh restart   # Restart server
./server-manager.sh status    # Check if running
```

### Solution 2: Manual Fix

**Step 1: Find what's using port 3000**
```bash
lsof -i :3000
```

**Step 2: Kill the process**
```bash
# Kill by port
lsof -ti:3000 | xargs kill -9

# Or kill by process ID (from step 1)
kill -9 <PID>
```

**Step 3: Start your server**
```bash
npm start
```

### Solution 3: Use a Different Port

Edit `server.js` or set environment variable:

```bash
PORT=3001 npm start
```

Then visit: http://localhost:3001

---

## ❌ Error: Cannot find module 'express'

### Problem
```
Error: Cannot find module 'express'
```

Dependencies are not installed.

### Solution

```bash
cd /Users/manas/IdeaProjects/MyDeveloperProfile
npm install
npm start
```

---

## ❌ Error: npm: command not found

### Problem
Node.js or npm is not installed.

### Solution

**Install Node.js:**
```bash
# Using Homebrew (recommended on macOS)
brew install node

# Verify installation
node --version
npm --version
```

---

## ❌ Error: Permission denied

### Problem
```
Error: EACCES: permission denied
```

### Solution

**For npm global packages:**
```bash
sudo npm install -g npm
```

**For project:**
```bash
# Fix ownership
sudo chown -R $USER:$USER /Users/manas/IdeaProjects/MyDeveloperProfile

# Then install
npm install
```

---

## ❌ Server starts but site doesn't load

### Problem
Server shows "running on port 3000" but http://localhost:3000 doesn't work.

### Solution

**Check if server is actually running:**
```bash
./server-manager.sh status
```

**Test with curl:**
```bash
curl http://localhost:3000
```

**Check firewall:**
- System Preferences → Security & Privacy → Firewall
- Allow Node.js if prompted

**Try different browser:**
- Clear browser cache
- Try incognito mode
- Try different browser

---

## ❌ Changes not showing on site

### Problem
Made changes but they don't appear when refreshing.

### Solution

**1. Hard refresh browser:**
- Mac: `Cmd + Shift + R`
- Windows: `Ctrl + Shift + R`

**2. Restart server:**
```bash
./server-manager.sh restart
```

**3. Clear browser cache:**
- Open DevTools (F12)
- Right-click refresh button
- Select "Empty Cache and Hard Reload"

**4. Check if file saved:**
- Verify your changes are saved
- Check correct file was edited

---

## ❌ Heroku deployment fails

### Problem
```
Build failed!
```

### Solution

**Check Heroku logs:**
```bash
heroku logs --tail -a manaskumarbehera
```

**Common fixes:**

1. **Missing Procfile**
   ```bash
   # Create Procfile
   echo "web: node server.js" > Procfile
   git add Procfile
   git commit -m "Add Procfile"
   git push origin main
   ```

2. **Wrong engines in package.json**
   ```json
   "engines": {
     "node": ">=18.x",
     "npm": ">=9.x"
   }
   ```

3. **Dependencies in devDependencies**
   - Move required packages to "dependencies"
   - Run `npm install --production`

4. **Port configuration**
   - Ensure server uses `process.env.PORT`
   - Already correct in your server.js

---

## ❌ GitHub push authentication failed

### Problem
```
remote: Invalid username or password
```

### Solution

**Use Personal Access Token:**

1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scope: `repo`
4. Copy token
5. Use as password when pushing

**Or set up SSH:**
```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
cat ~/.ssh/id_ed25519.pub
# Add to GitHub: Settings → SSH Keys
```

---

## ❌ Git not initialized

### Problem
```
fatal: not a git repository
```

### Solution

```bash
cd /Users/manas/IdeaProjects/MyDeveloperProfile
git init
git branch -M main
git add .
git commit -m "Initial commit"
```

---

## 🆘 Quick Diagnostic Commands

**Check if server is running:**
```bash
./server-manager.sh status
# or
lsof -i :3000
```

**Check Node/npm versions:**
```bash
node --version
npm --version
```

**Check dependencies installed:**
```bash
ls -la node_modules | wc -l
```

**Check for errors in server.js:**
```bash
node -c server.js
```

**Test port 3000:**
```bash
curl http://localhost:3000
```

**View server logs (if running in background):**
```bash
ps aux | grep "node server.js"
```

---

## 🎯 Common Workflow Issues

### Issue: Server stops when closing terminal

**Solution:** Use a process manager

**Option 1: Run in background**
```bash
nohup npm start > server.log 2>&1 &
```

**Option 2: Use screen/tmux**
```bash
screen -S portfolio
npm start
# Press Ctrl+A then D to detach
# screen -r portfolio to reattach
```

**Option 3: Use PM2 (production)**
```bash
npm install -g pm2
pm2 start server.js --name portfolio
pm2 save
pm2 startup
```

### Issue: Port keeps getting used

**Find what's using port 3000:**
```bash
lsof -i :3000
```

**Possible culprits:**
- Previous npm start still running
- Another Node app
- Docker container
- Other development server

**Fix:**
```bash
./server-manager.sh stop
# Then start again
./server-manager.sh start
```

---

## 📱 Testing Checklist

Before deploying, verify:

- [ ] `npm start` works locally
- [ ] Site loads at http://localhost:3000
- [ ] No errors in browser console (F12)
- [ ] All links work
- [ ] GitHub username updated in js/main.js
- [ ] Email updated in index.html
- [ ] Mobile view works (F12 → device toolbar)
- [ ] Changes committed to Git
- [ ] Pushed to GitHub

---

## 🔍 Debug Mode

Run server with verbose output:

```bash
DEBUG=* npm start
```

Or with Node debugging:

```bash
node --inspect server.js
```

Then open Chrome and go to: `chrome://inspect`

---

## 💡 Tips

1. **Always use the server manager script** - It handles port conflicts automatically
2. **Check server status before starting** - Avoid multiple instances
3. **Hard refresh browser** - Clear cache when testing changes
4. **Check both terminal and browser console** - Errors can appear in either
5. **Read error messages carefully** - They usually tell you what's wrong

---

## 🆘 Still Having Issues?

1. **Check all log files**
2. **Try restarting computer**
3. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
4. **Check this troubleshooting guide**
5. **Review DEPLOYMENT.md for deployment issues**

---

## 📞 Quick Command Reference

```bash
# Start server (auto-fixes port conflicts)
./server-manager.sh start

# Stop server
./server-manager.sh stop

# Restart server
./server-manager.sh restart

# Check status
./server-manager.sh status

# View in browser
open http://localhost:3000

# Kill port 3000 manually
lsof -ti:3000 | xargs kill -9

# Reinstall dependencies
npm install

# Run on different port
PORT=3001 npm start
```

---

**Most common issue:** Port 3000 already in use  
**Quick fix:** `./server-manager.sh start`

That's it! The server manager script solves 90% of startup issues automatically! 🚀

