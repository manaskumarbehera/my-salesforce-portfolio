# 📚 Documentation

Welcome to your Salesforce Developer Portfolio documentation!

## 🌟 What's New (2026)

- **📧 Email System Upgrade** - Custom domain email support (SMTP/Forward modes)
- **🤖 AI Chatbot** - Interactive assistant to answer visitor questions
- **⭐ Recommendations System** - Collect and display testimonials
- **📊 Chrome Extension Stats API** - Real-time user counts from Web Store
- **📈 Analytics Dashboard** - Track page views and interactions

## 🎯 Start Here

**New to the project? Read this first:**
- **[START_HERE.md](START_HERE.md)** ⭐ - Quick setup in 5 minutes

## 📖 All Guides

### Essential Guides
1. **[START_HERE.md](START_HERE.md)** - Quick setup & getting started
2. **[INTELLIJ.md](INTELLIJ.md)** - IntelliJ setup & one-click commands
3. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy to Heroku
4. **[EMAIL_SETUP.md](EMAIL_SETUP.md)** - Email DNS & SMTP configuration ⭐ NEW
5. **[TESTING.md](TESTING.md)** - Testing guide
6. **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Fix common issues

### Configuration & Features
- **[CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md)** - Environment variables & API setup
- **[PORTFOLIO_DATA.md](PORTFOLIO_DATA.md)** - Projects & Chrome extensions config ⭐ NEW
- **[API.md](API.md)** - Complete API reference
- **[CUSTOMIZATION.md](CUSTOMIZATION.md)** - Customize your portfolio

### Domain & Hosting
- **[DOMAIN.md](DOMAIN.md)** - Domain configuration (manaskumarbehera.com) ⭐
- **[DOMAIN_SETUP_GUIDE.md](DOMAIN_SETUP_GUIDE.md)** - Step-by-step domain setup

---

## 🔌 API Reference

### Contact API
```bash
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Hello",
  "message": "Your message here"
}
```

### Chat API (AI Chatbot)
```bash
POST /api/chat
Content-Type: application/json

{ "message": "What are your skills?" }
```

### Recommendations API
```bash
# Get approved recommendations
GET /api/recommendations

# Submit new recommendation
POST /api/recommendations
```

### Chrome Extension Stats API
```bash
# Get all extension stats
GET /api/extensions/stats

# Get specific extension
GET /api/extensions/trackforcepro/stats
GET /api/extensions/weeknumber/stats
GET /api/extensions/metaforce/stats
```

---

## 🔍 Quick Answers

### "How do I start?"
```bash
npm install && npm start
```
See: [START_HERE.md](START_HERE.md)

### "How do I deploy?"
```bash
git push heroku main
```
See: [DEPLOYMENT.md](DEPLOYMENT.md)

### "How do I use IntelliJ?"
Click the dropdown at top-right → Select command → Run
See: [INTELLIJ.md](INTELLIJ.md)

### "How do I run tests?"
```bash
npm test
```
See: [TESTING.md](TESTING.md)

### "How do I configure email notifications?"
```bash
heroku config:set EMAIL_USER=your-email@outlook.com
heroku config:set EMAIL_PASS=your-app-password
```
See: [CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md)

---

## 📁 Documentation Structure

```
docs/
├── README.md              ← You are here
├── START_HERE.md          ← Start here!
├── INTELLIJ.md            ← IntelliJ setup
├── DEPLOYMENT.md          ← Deploy guide
├── TESTING.md             ← Testing guide
├── TROUBLESHOOTING.md     ← Fix issues
├── API.md                 ← API reference (NEW!)
├── CONFIGURATION_GUIDE.md ← API & env setup
├── CUSTOMIZATION.md       ← Customize
├── DOMAIN.md              ← Domain config
└── DOMAIN_SETUP_GUIDE.md  ← Domain setup
```

---

## ⚡ Common Tasks

### Development
```bash
npm start           # Start server
npm test            # Run tests
npm run dev         # Auto-reload
```

### Deployment
```bash
npm run validate    # Check syntax
npm run build       # Build
git push heroku main  # Deploy to Heroku
```

### View Logs
```bash
heroku logs --tail -a manaskumarbehera
```

### IntelliJ (One-Click)
- Click dropdown at top-right
- Select: `npm: Test` or `npm: Deploy`
- Click Run

---

## 🆘 Need Help?
