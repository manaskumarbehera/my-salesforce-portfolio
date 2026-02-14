# 🚀 Quick IntelliJ + NPM Setup Guide

## ⚡ 5-Minute Setup

### Step 1: Open IntelliJ IDEA

Open your project:
```
File → Open → /Users/manas/IdeaProjects/MyDeveloperProfile
```

### Step 2: Refresh Project

The run configurations will be auto-detected:
```
File → Invalidate Caches → Invalidate and Restart
```

Or: Just close and reopen IntelliJ

### Step 3: Check Run Configurations

**Top right corner of IntelliJ:**
- Look for dropdown selector
- Should show: "Start Server", "Run Tests", "Build", "Deploy", "Commit"

If not visible:
- Go to: Run → Edit Configurations
- Click the dropdown to see all 5 configurations

### Step 4: Test It!

**Select "Start Server":**
1. Click dropdown at top-right
2. Select "Start Server"
3. Click green ▶️ Run button (or press Ctrl+D / Cmd+D)

**Output:**
```
Starting Node application...
🎉 Portfolio server running at http://localhost:3000
```

### Step 5: Test a Script

**In terminal:**
```bash
npm test
```

---

## 🎯 Using the Configurations

### Run from IntelliJ (Easiest!)

1. **Top-right corner dropdown:**
   ```
   [Start Server ▼]
   ```

2. **Click dropdown, select:**
   - ▶️ Start Server - Starts Node server
   - 🧪 Run Tests - Runs 12 tests
   - 🏗️ Build - Full build validation
   - 🚀 Deploy - Automated deployment
   - 💾 Commit - Git commit

3. **Click green Run button (▶️)**
   - Or press: `Ctrl+D` (Cmd+D on Mac)

### Run from Terminal

```bash
npm start              # Dev server
npm test              # Run tests
npm run build         # Build
npm run deploy        # Deploy
npm run commit        # Commit
```

---

## 📋 All 5 Configurations

### 1️⃣ Start Server
```
Type: Node.js
Script: server.js
Port: 3000
Env: NODE_ENV=development
```

### 2️⃣ Run Tests
```
Type: Node.js
Script: test/portfolio.test.js
Requires: Server running!
Tests: 12 automated tests
```

### 3️⃣ Build
```
Type: Shell Script
Command: npm run build
Validates: Everything
Output: Build info
```

### 4️⃣ Deploy
```
Type: Shell Script
Command: npm run deploy
Action: Full deployment
Result: Live on Heroku!
```

### 5️⃣ Commit
```
Type: Shell Script
Command: npm run commit
Interactive: Asks for message
Result: Saved to Git
```

---

## ⌨️ Keyboard Shortcuts

```
Ctrl+D (or Cmd+D)     # Run current config
Shift+F10             # Run
Shift+F9              # Debug
Ctrl+F2               # Stop
Alt+F9                # View breakpoints
Shift+Alt+F10         # Edit configurations
```

---

## 🔄 Complete Workflow in IntelliJ

### Morning Development:

**Terminal 1 - Start Server:**
```
1. Select "Start Server" from dropdown
2. Press Ctrl+D
3. Server running on port 3000
```

**Terminal 2 - Make Changes:**
```
1. Edit files in IntelliJ editor
2. Changes appear instantly in browser
```

**Terminal 3 - Test:**
```
1. Select "Run Tests"
2. Press Ctrl+D
3. All 12 tests run
```

**Terminal - Commit:**
```
1. Select "Commit"
2. Press Ctrl+D
3. Enter commit message
```

---

## 🎨 Pro Tips

### 1. Multiple Terminals

IntelliJ has built-in terminal:
- Bottom of window: "Terminal" tab
- Ctrl+` (backtick) to toggle
- Create multiple tabs

### 2. Run In Terminal

Right-click any npm script in package.json:
```
Run 'npm start'
Run 'npm test'
etc.
```

### 3. Debug Mode

Select config, then:
- Shift+F9 (Debug)
- Set breakpoints
- Step through code

### 4. View Output

All output appears in:
- "Run" tab at bottom
- Or "Terminal" tab
- Embedded in IntelliJ

### 5. Restart App

After code changes:
- Cmd+R (Mac) or Ctrl+R (Windows)
- In embedded terminal
- App restarts automatically

---

## 🚀 First Time Test

### Test 1: Start Server
```
1. Dropdown → "Start Server"
2. Ctrl+D
3. Check bottom: "Running..."
4. Open browser: http://localhost:3000
5. Portfolio loads! ✅
```

### Test 2: Run Tests
```
1. Keep server running (Terminal 1)
2. New terminal: Select "Run Tests"
3. Ctrl+D
4. Should see 12 tests passing ✅
```

### Test 3: Build
```
1. Dropdown → "Build"
2. Ctrl+D
3. Should see: "Build complete!" ✅
```

### Test 4: Commit
```
1. Make a file change
2. Dropdown → "Commit"
3. Ctrl+D
4. Enter message: "Test commit"
5. Should see: "Commit successful" ✅
```

---

## 🆘 Troubleshooting

### Configs Not Showing?
```
1. Go to: Run → Edit Configurations
2. Should list 5 configs
3. If not: File → Invalidate Caches → Restart
```

### Server Won't Start?
```
1. Check: npm install
2. Check port: netstat -an | grep 3000
3. Try: npm run validate
```

### Tests Fail?
```
1. Server must be running first!
2. Terminal 1: npm start
3. Terminal 2: npm test
4. Or use IntelliJ with 2 config runs
```

### Keys Not Working?
```
Check Settings → Keymap
Mac: Use Cmd instead of Ctrl
Windows: Use Ctrl
```

---

## 📚 Reference Files

All documentation available in `docs/`:

- **INTELLIJ_SETUP.md** - Full IntelliJ guide
- **NPM_SCRIPTS_GUIDE.md** - All 25+ scripts
- **NEW_FEATURES.md** - Feature details
- **DEPLOYMENT.md** - Deploy guide

---

## 🎊 You're Ready!

Your IntelliJ is configured with:
✅ 5 production-ready run configs
✅ 25+ npm scripts
✅ Complete automation
✅ One-click deployment

**Try it now:**
1. Open IntelliJ
2. Dropdown → "Start Server"
3. Press Ctrl+D
4. 🎉 It works!

---

## 🚀 Next Steps

1. **Start server:** Select "Start Server" + Ctrl+D
2. **Test everything:** npm test
3. **Build:** Select "Build" + Ctrl+D
4. **Deploy:** Select "Deploy" + Ctrl+D
5. **Monitor:** npm run logs

---

**Your development environment is fully automated!** ⚡

**Everything from IntelliJ with one button!** 🎯

**25+ npm scripts ready to use!** 📦

**Deploy with confidence!** 🚀

