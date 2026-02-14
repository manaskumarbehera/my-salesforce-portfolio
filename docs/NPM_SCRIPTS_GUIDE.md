# 📦 NPM Scripts Guide - Complete Package

## 🎯 All Available NPM Scripts

Your `package.json` now contains 25+ production-ready scripts for every workflow.

---

## 📋 Complete Script Reference

### 🚀 START & DEVELOPMENT

```bash
npm start                # Start production server
npm run dev              # Start with auto-reload (nodemon)
```

**Use:**
- `npm start` - Production server
- `npm run dev` - Development with auto-reload on file changes

---

### 🧪 TESTING

```bash
npm test                 # Run all 12 tests
npm run test:watch      # Watch mode (re-run on changes)
```

**Use:**
- Before committing
- Before deploying
- After making changes

---

### 🏗️ BUILD & VALIDATION

```bash
npm run build           # Full build with validation
npm run prebuild        # Pre-build checks
npm run postbuild       # Post-build cleanup
npm run validate        # Check server.js syntax
npm run check:docs      # Count documentation files
npm run lint            # Code linting (ready to add)
```

**Use:**
- `npm run build` - Complete build process
- `npm run validate` - Quick syntax check

---

### 💾 GIT OPERATIONS

```bash
npm run commit          # Interactive commit (prompts for message)
npm run commit:docs     # Commit docs/ changes only
npm run commit:all      # Stage all + commit
npm run push            # Push to GitHub
npm run push:heroku     # Push to Heroku
```

**Use:**
- `npm run commit` - Save changes
- `npm run commit:docs` - Commit only documentation updates
- `npm run push` - Push to GitHub

---

### 🚀 DEPLOYMENT

```bash
npm run deploy          # Full automated deployment
npm run predeploy       # Pre-deploy checks (runs before deploy)
npm run deploy:heroku   # Direct push to Heroku
npm run deploy:force    # Force push to Heroku
```

**Use:**
- `npm run deploy` - **RECOMMENDED** - Full automation
- `npm run deploy:heroku` - Quick push if you've already tested
- `npm run deploy:force` - Override (use with caution!)

---

### 📊 MONITORING

```bash
npm run logs            # View live Heroku logs
npm run logs:error      # View only error logs
npm run open            # Open live app in browser
npm run status          # Check Heroku app status
npm run restart         # Restart Heroku app
```

**Use for Production Monitoring:**
- `npm run logs` - Watch what's happening live
- `npm run status` - Check if app is running
- `npm run restart` - Bounce app if issues

---

## 🎯 Common Workflows

### Workflow 1: Daily Development

```bash
# Morning: Start dev server
npm run dev

# Make changes... code...

# Test your changes
npm test

# Commit progress
npm run commit

# End of day: Push to GitHub
npm run push
```

---

### Workflow 2: Documentation Update

```bash
# Create/edit docs in docs/ folder
echo "# New Guide" > docs/GUIDE.md

# Update docs/README.md with link

# Commit only docs
npm run commit:docs

# Push to GitHub
npm run push
```

---

### Workflow 3: Complete Deployment

```bash
# Build with validation
npm run build

# Run all tests
npm test

# Commit changes
npm run commit

# Push to GitHub
npm run push

# Full deployment to Heroku
npm run deploy

# Verify it's live
npm run open
```

---

### Workflow 4: Quick Fix & Deploy

```bash
# Make quick fix
# Edit file...

# Validate it works
npm test

# Commit fix
npm run commit

# Deploy
npm run deploy

# Check live
npm run logs
```

---

### Workflow 5: Emergency Rollback

```bash
# Stop current app
npm run restart

# Check what went wrong
npm run logs:error

# View all activity
npm run logs

# Revert last commit and push
git revert HEAD
npm run push:heroku

# Monitor
npm run status
```

---

## 📚 Script Details

### npm start
**Purpose:** Run production server
**Output:** Server listening on port 3000
**Stop:** Ctrl+C
**Use:** After deployment, production environment

### npm run dev
**Purpose:** Development server with auto-reload
**Output:** Watching for file changes
**Requires:** nodemon installed
**Use:** Local development

### npm test
**Purpose:** Run 12 automated tests
**Tests:** Server, HTML, links, security, assets
**Requirements:** Server must be running!
**Output:** Pass/fail count
**Use:** Validation before any deployment

### npm run test:watch
**Purpose:** Watch mode - re-run tests when files change
**Output:** Continuous test results
**Use:** Development - see tests update instantly

### npm run build
**Purpose:** Complete build with all validations
**Validates:** Dependencies, files, config, docs
**Creates:** build-info.json
**Use:** Before production deployment

### npm run validate
**Purpose:** Quick syntax check
**Checks:** server.js JavaScript syntax
**Output:** "Syntax valid" or error details
**Use:** Quick pre-commit check

### npm run deploy
**Purpose:** Full automated deployment
**Steps:** Build → Test → Commit → Push → Deploy
**Interactive:** Asks questions if needed
**Use:** **RECOMMENDED** for production

### npm run logs
**Purpose:** View live Heroku logs
**Streams:** Real-time server output
**Stop:** Ctrl+C
**Use:** Monitor production app

### npm run open
**Purpose:** Open app in default browser
**Opens:** https://manas-behera-dev-5a0040c069c1.herokuapp.com/
**Use:** Quick browser check

### npm run status
**Purpose:** Check Heroku app status
**Shows:** Running dynos, status, activity
**Use:** Verify app is operational

---

## 🎨 Npm Script Lifecycle

### Auto-Running Hooks

These run automatically:

```bash
npm run predeploy      # Runs before deploy
npm run prebuild       # Runs before build
npm run postbuild      # Runs after build
```

---

## ⚙️ Environment Variables

Scripts use:
- `NODE_ENV` - development, test, production
- `PORT` - 3000 (default)
- `HEROKU_APP` - manas-behera-dev

Set custom:
```bash
PORT=3001 npm start
NODE_ENV=production npm start
```

---

## 🔧 Customizing Scripts

Edit `package.json` `scripts` section:

```json
"scripts": {
  "start": "node server.js",
  "mycommand": "your-command-here"
}
```

Then run:
```bash
npm run mycommand
```

---

## 📊 Script Categories

| Category | Scripts | Count |
|----------|---------|-------|
| Development | start, dev | 2 |
| Testing | test, test:watch | 2 |
| Building | build, prebuild, postbuild | 3 |
| Validation | validate, check:docs, lint | 3 |
| Git Operations | commit*, push* | 5 |
| Deployment | deploy*, deploy:heroku | 3 |
| Monitoring | logs*, open, status, restart | 4 |
| **Total** | | **25+** |

---

## 🎓 Script Best Practices

1. **Always test before deploying**
   ```bash
   npm test && npm run deploy
   ```

2. **Use meaningful commit messages**
   ```bash
   npm run commit
   # When prompted, enter: "Added new features"
   ```

3. **Monitor after deployment**
   ```bash
   npm run deploy
   npm run logs  # Watch for issues
   ```

4. **Commit docs separately when appropriate**
   ```bash
   npm run commit:docs
   npm run push
   ```

5. **Build before critical operations**
   ```bash
   npm run build
   npm test
   npm run deploy
   ```

---

## 🚨 Common Script Issues

### "npm: command not found"
```
npm is not installed
Install Node.js from https://nodejs.org/
```

### "Module not found"
```
Dependencies not installed
Run: npm install
```

### "Port 3000 already in use"
```
Use different port:
PORT=3001 npm start
```

### "Tests won't run"
```
Server not running
Terminal 1: npm start
Terminal 2: npm test
```

### "Deploy fails"
```
Check branch: git branch
Should be: main

Check commits: git status
All saved and pushed?
```

---

## 📱 Mobile/Quick Reference

**Most Used Commands:**
```bash
npm start              # Dev
npm test              # Validate
npm run deploy        # Deploy
npm run logs          # Monitor
```

**Package Sizes:**
```bash
npm run check:docs    # See doc count
```

---

## 🎯 Next Steps

1. **Try a script:**
   ```bash
   npm test
   ```

2. **Test all scripts:**
   ```bash
   npm run validate    # Quick check
   npm run build       # Full check
   npm test            # Full tests
   ```

3. **Deploy with confidence:**
   ```bash
   npm run deploy
   ```

---

## 📚 See Also

- [INTELLIJ_SETUP.md](INTELLIJ_SETUP.md) - Run from IDE
- [NEW_FEATURES.md](NEW_FEATURES.md) - Feature details
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment details

---

**Your complete npm package is ready!** 📦

**25+ scripts for every task!** ✨

**Run `npm test` to see everything working!** 🚀

