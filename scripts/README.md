# Scripts Directory

This directory contains automation scripts for building and deploying your portfolio.

## 📁 Scripts

### build.sh
**Purpose:** Build and validate the portfolio before deployment

**What it does:**
- Checks and installs dependencies
- Validates code quality
- Verifies all critical files exist
- Checks documentation structure
- Validates configuration (GitHub username, email)
- Creates build metadata

**Usage:**
```bash
npm run build
# or
./scripts/build.sh
```

**Exit codes:**
- `0` - Build successful
- `1` - Build failed (check errors)

---

### deploy.sh
**Purpose:** Automated deployment to Heroku with pre-checks

**What it does:**
- Checks for uncommitted changes
- Optionally commits changes
- Runs build script
- Runs test suite
- Validates Git branch
- Pushes to Heroku
- Shows deployment status

**Usage:**
```bash
npm run deploy
# or
./scripts/deploy.sh
```

**Interactive features:**
- Prompts to commit uncommitted changes
- Asks to continue if tests fail
- Confirms if not on 'main' branch

**Exit codes:**
- `0` - Deployment successful
- `1` - Deployment failed

---

## 🎯 Quick Reference

### Build Only
```bash
npm run build
```

### Deploy (Full Process)
```bash
npm run deploy
```

### Direct Heroku Push (Skip Checks)
```bash
npm run deploy:heroku
```

### Force Deploy
```bash
npm run deploy:force
```

---

## 🔧 Customization

### Modify Build Checks

Edit `build.sh`:
- Add/remove critical files
- Change validation logic
- Adjust error messages

### Modify Deployment Flow

Edit `deploy.sh`:
- Change Heroku app name
- Modify branch name
- Add/remove pre-deployment steps

---

## 📋 Script Requirements

Both scripts require:
- Git installed and initialized
- Node.js and npm installed
- Heroku CLI installed (for deployment)
- Heroku remote configured

---

## ⚠️ Troubleshooting

### Build Fails
```bash
# Check what failed
./scripts/build.sh

# Common issues:
# - Missing files
# - GitHub username not set
# - Email not configured
# - Documentation structure wrong
```

### Deploy Fails
```bash
# Check Heroku logs
npm run logs

# Common issues:
# - Heroku remote not set
# - Tests failing
# - Wrong branch
# - Uncommitted changes
```

---

## 💡 Tips

1. **Always build before deploying**
   ```bash
   npm run build && npm run deploy
   ```

2. **Test locally first**
   ```bash
   npm start
   npm test
   npm run build
   ```

3. **Use automated deploy for best results**
   ```bash
   npm run deploy  # Does everything
   ```

---

## 🎓 Learning More

See documentation:
- [docs/NEW_FEATURES.md](../docs/NEW_FEATURES.md) - Complete feature guide
- [docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md) - Deployment details
- [docs/TROUBLESHOOTING.md](../docs/TROUBLESHOOTING.md) - Fix issues

---

**These scripts automate your entire workflow!** 🚀

**Use `npm run deploy` for worry-free deployment!** ✨

