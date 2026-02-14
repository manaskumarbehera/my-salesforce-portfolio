# 🔧 IntelliJ Setup & Usage

## ⚡ Quick Access to All Commands

**Look at the top-right corner of IntelliJ IDEA:**

```
┌─────────────────────────────────────┐
│  [▼ npm: Test]   [▶️ Run]  [🐛 Debug]  │  ← Click here!
└─────────────────────────────────────┘
```

---

## 🎯 Available Commands

Click the dropdown (▼) to see:

| Command | What It Does |
|---------|--------------|
| **npm: Start Server** | Start server on http://localhost:3000 |
| **npm: Test** | Run all 52 tests |
| **npm: Test Coverage** | Run tests with coverage report |
| **npm: Validate** | Quick syntax check |
| **npm: Commit** | Git commit (prompts for message) |
| **npm: Build** | Build the project |
| **npm: Deploy** | Deploy to Heroku |
| **npm: Release** | Complete: validate → test → commit → deploy |

---

## 🚀 How to Use

### Start Development
1. Click dropdown (▼)
2. Select: `npm: Start Server`
3. Click Run (▶️)
4. Visit: http://localhost:3000

### Run Tests
1. Click dropdown (▼)
2. Select: `npm: Test`
3. Click Run (▶️)

### Deploy Everything
1. Click dropdown (▼)
2. Select: `npm: Release`
3. Click Run (▶️)
4. Enter commit message
5. Done! 🎉

---

## ⌨️ Keyboard Shortcuts

**Open Run Menu:**
- Windows/Linux: `Ctrl+Shift+R`
- Mac: `Cmd+Shift+R`

**Re-run Last:**
- Windows/Linux: `Ctrl+F5`
- Mac: `Cmd+R`

---

## 🔍 Troubleshooting

### Configurations Not Showing?

**Solution 1: Restart IntelliJ**
```
File → Invalidate Caches / Restart → Invalidate and Restart
```

**Solution 2: Check Files**
```bash
ls .idea/runConfigurations/
# Should show 8 .xml files
```

**Solution 3: Manual Setup**
1. Go to: `Run → Edit Configurations`
2. Click `+` → Select `npm`
3. Configure:
   - Package.json: Select your package.json
   - Command: `run`
   - Scripts: Select the script (e.g., `test`)
4. Click OK

---

## 💡 Pro Tips

### 1. Pin Frequently Used
- Right-click on a config
- Select "Pin Configuration"

### 2. Use Debug Mode
- Click debug icon (🐛) instead of run
- Works with all configurations

### 3. View Multiple Outputs
- All outputs appear in bottom panel
- Click tabs to switch between them

### 4. Auto-reload During Development
```bash
npm run dev  # Uses nodemon for auto-reload
```

---

## 📊 All npm Scripts

### Development
```bash
npm start                # Start server
npm run dev              # Start with auto-reload
npm test                 # Run all tests
npm run test:coverage    # Tests with coverage
npm run test:watch       # Watch mode
```

### Build & Deploy
```bash
npm run validate         # Syntax check
npm run build            # Build project
npm run deploy           # Deploy to Heroku
npm run release          # All-in-one deployment
```

### Git
```bash
npm run commit           # Stage and commit
npm run push             # Push to origin
```

### Heroku Management
```bash
npm run logs             # View logs
npm run status           # Check status
npm run restart          # Restart app
npm run open             # Open in browser
```

---

## ✅ Verification

After setup, verify:
```bash
npm run validate && npm test
```

All 52 tests should pass! ✅

---

**Need Help?**
- See: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- See: [START_HERE.md](./START_HERE.md)

