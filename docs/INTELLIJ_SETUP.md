# 🔧 IntelliJ IDEA Run Configurations

## 🎯 Quick Setup

Your run configurations are already created in `.idea/runConfigurations.xml`

**Available in IntelliJ:**
1. ▶️ Start Server
2. 🧪 Run Tests
3. 🏗️ Build
4. 🚀 Deploy
5. 💾 Commit

---

## 🚀 Using Run Configurations

### Method 1: Run Button (Easiest!)

**In IntelliJ IDEA:**

1. **Open Run Menu:**
   - Top menu → Run → Edit Configurations
   - Or: Top right corner → dropdown selector

2. **Select Configuration:**
   - Dropdown shows: "Start Server", "Run Tests", "Build", "Deploy", "Commit"
   - Click which one you want to run

3. **Click Run Button:**
   - Green ▶️ button at top
   - Or press: `Ctrl+D` (or `Cmd+D` on Mac)

### Method 2: Run/Debug Configurations

**In IntelliJ IDEA:**

1. **Menu:** Run → Edit Configurations
2. **Select from list:**
   - Start Server
   - Run Tests
   - Build
   - Deploy
   - Commit
3. **Click Run (Green ▶️ button)**

### Method 3: Keyboard Shortcuts

```bash
Ctrl+D (Cmd+D Mac)  # Run selected configuration
Ctrl+Shift+D        # Debug configuration
Shift+F10           # Run default config
```

---

## ▶️ Start Server

**What it does:**
- Starts Node.js server
- Listens on port 3000
- Sets NODE_ENV to development

**Use when:**
- Starting development
- Testing locally
- Before running tests

**Output:**
```
Starting server on port 3000
🎉 Portfolio server running!
Visit http://localhost:3000
```

**Keyboard:** Select "Start Server" → Press `Ctrl+D`

---

## 🧪 Run Tests

**What it does:**
- Runs all 12 tests
- Validates portfolio
- Checks links and content

**Use when:**
- Before committing
- Before deploying
- Validating changes

**Prerequisites:**
- Server must be running in another terminal!

**Output:**
```
Running Portfolio Tests...
✓ Server is running
✓ HTML content served
... 10 more tests
Passed: 12
```

**Keyboard:** Select "Run Tests" → Press `Ctrl+D`

---

## 🏗️ Build

**What it does:**
- Validates everything
- Checks dependencies
- Verifies configuration
- Creates build info

**Use when:**
- Before deploying
- Checking project integrity
- Preparing for production

**Output:**
```
🏗️ Building portfolio...
✓ Dependencies installed
✓ All critical files present
✓ Build complete!
```

**Keyboard:** Select "Build" → Press `Ctrl+D`

---

## 🚀 Deploy

**What it does:**
- Full deployment automation
- Runs build and tests
- Pushes to Heroku
- Shows live URL

**Use when:**
- Ready to go live
- Pushing updates
- Full release process

**Output:**
```
🚀 Starting deployment...
✓ Build succeeded
✓ Tests passed
✓ Deployed to Heroku
Your portfolio is live!
```

**Keyboard:** Select "Deploy" → Press `Ctrl+D`

---

## 💾 Commit

**What it does:**
- Interactive git commit
- Prompts for message
- Stages changes
- Commits to local repo

**Use when:**
- Saving changes
- Before pushing
- Creating checkpoints

**Output:**
```
✓ Files staged
Enter commit message:
[your message]
✓ Committed!
```

**Keyboard:** Select "Commit" → Press `Ctrl+D`

---

## 📋 Complete Workflow in IntelliJ

### Development Session:

1. **Start Server**
   - Select "Start Server" → `Ctrl+D`
   - Server running on http://localhost:3000

2. **Make Changes**
   - Edit files in editor
   - See changes in browser (with auto-reload in dev mode)

3. **Run Tests** (in new terminal)
   - Select "Run Tests" → `Ctrl+D`
   - Validates all changes

4. **Commit Changes**
   - Select "Commit" → `Ctrl+D`
   - Enter message
   - Changes saved

5. **Deploy**
   - Select "Build" → `Ctrl+D`
   - Select "Deploy" → `Ctrl+D`
   - Live on production!

---

## 🔧 Manual Configuration (If Needed)

### Add Run Configuration Manually:

1. **Open Run Configurations:**
   - Menu: Run → Edit Configurations
   - Or: Shift+Alt+F10 on Windows, Shift+Cmd+R on Mac

2. **Add New Configuration:**
   - Click + button
   - Select type (Node.js, Shell Script, npm)

3. **Configure Start Server:**
   - Name: "Start Server"
   - Type: Node.js
   - Node interpreter: project
   - Node app path: server.js
   - Port: 3000

4. **Configure Run Tests:**
   - Name: "Run Tests"
   - Type: Node.js
   - Node interpreter: project
   - Node app path: test/portfolio.test.js

5. **Configure Build:**
   - Name: "Build"
   - Type: Shell Script
   - Script: npm run build

6. **Configure Deploy:**
   - Name: "Deploy"
   - Type: Shell Script
   - Script: npm run deploy

7. **Configure Commit:**
   - Name: "Commit"
   - Type: Shell Script
   - Script: npm run commit

---

## ⌨️ Keyboard Shortcuts

```
Shift+Alt+F10  (Windows)    # Open run configurations
Shift+Cmd+R    (Mac)         # Open run configurations
Ctrl+D         (Windows)    # Run selected config
Ctrl+Shift+D   (Windows)    # Debug config
Cmd+D          (Mac)         # Run selected config
F9             # Resume program
Shift+F9       # Debug
F8             # Step over
F7             # Step into
Shift+F8       # Step out
```

---

## 🎨 Tips & Tricks

### 1. Favorite Configurations

Make frequently-used configs show at top:
- Right-click configuration
- Select "Show in Run menu"

### 2. Temporary Configurations

Run single commands:
- Ctrl+Shift+Alt+X (Windows) or Cmd+Shift+X (Mac)
- Type command to run

### 3. Edit Before Running

- Select configuration
- Click "Edit" pencil icon
- Modify parameters
- Run

### 4. View Output

Configurations output appears in:
- "Run" tab at bottom of IntelliJ
- Terminal is embedded at bottom

### 5. Stop Running Process

- Red stop button in bottom-left
- Or press Ctrl+F2 (or Cmd+F2 on Mac)

---

## 🚨 Troubleshooting

### "Module not found"
```
Run in terminal first:
npm install
```

### "Port already in use"
```
- Stop previous server first
- Or use different port:
  PORT=3001 npm start
```

### "Tests won't run"
```
Make sure server is running:
1. Start Server config
2. Then Run Tests config
3. In separate terminals
```

### "Deploy fails"
```
Check:
1. You're on main branch
2. All tests pass
3. Heroku remote configured
4. You're logged in to Heroku
```

---

## 📚 Configuration File

All configurations saved in:
```
.idea/runConfigurations.xml
```

This file is version-controlled, so configurations sync with your repo!

---

## 🎯 Quick Reference

| Command | IntelliJ | Terminal | Use |
|---------|----------|----------|-----|
| Start Server | Select + Ctrl+D | `npm start` | Development |
| Run Tests | Select + Ctrl+D | `npm test` | Validation |
| Build | Select + Ctrl+D | `npm run build` | Pre-deploy |
| Deploy | Select + Ctrl+D | `npm run deploy` | Production |
| Commit | Select + Ctrl+D | `npm run commit` | Git save |

---

## 🎊 All Set!

Your IntelliJ is configured with:
✅ 5 ready-to-use run configurations
✅ Keyboard shortcuts
✅ Embedded terminal output
✅ Version-controlled settings

**Start using:**
1. Open Run Configuration selector (top right)
2. Pick a configuration
3. Click green Run button
4. Done! 🚀

---

**Your entire workflow is now one button click away!** ✨

**Happy coding!** 💻

