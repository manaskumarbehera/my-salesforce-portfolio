# Configuration Guide 📋

> **A simple guide explaining how everything is set up - no technical jargon!**

---

## What is This Project?

This is your **personal portfolio website** - a website that shows off your skills, projects, and contact information. Think of it like your online resume or business card.

---

## Where Does Your Code Live?

### GitHub (Your Code Storage) 🏠

**What is it?**  
GitHub is like Google Drive, but for code. It safely stores all your website files and keeps track of every change you make.

**Your GitHub Repository:**  
🔗 https://github.com/manaskumarbehera/my-salesforce-portfolio

**Why use it:**  
- Every time you make changes, they get saved here
- It's your backup - if your computer crashes, your code is safe on GitHub
- Other developers can see your work (great for job applications!)

---

## Key Files Explained

### `package.json` - The Project Settings

This file contains:
- **Project name:** `salesforce-developer-portfolio`
- **Version:** `1.0.0`
- **Commands:** Shortcuts to do common tasks (like `npm run push` to save to GitHub)

**Important commands you can use:**

| Command | What it does |
|---------|--------------|
| `npm start` | Runs your website locally (on your computer) |
| `npm run push` | Saves your changes to GitHub |
| `npm test` | Checks if everything is working correctly |

---

### `js/main.js` - Website Behavior

This file controls how your website works. Key settings:

| Setting | Current Value | What it means |
|---------|---------------|---------------|
| `GITHUB_USERNAME` | `manaskumarbehera` | Your GitHub username for showing your projects |
| Featured Projects | `4` | Shows 4 of your latest GitHub projects on the website |

---

## Git Remote (Where Code Gets Sent)

| Remote Name | Destination | Purpose |
|-------------|-------------|---------|
| `origin` | GitHub | Your code storage |

**Current setup:**
- When you "push" code, it goes to **GitHub** ✅

---

## Common Tasks - How To Do Them

### "I made changes and want to save them"

```bash
npm run push
```
This saves your changes to GitHub.

---

### "I want to see my website locally before publishing"

```bash
npm start
```
Then open your browser and go to: http://localhost:3000

---

### "I want to commit with a custom message"

```bash
npm run commit:quick "Your message here"
```

---

### "Something went wrong, I want to check for errors"

```bash
npm test
```

---

## 🔌 API Endpoints

Your portfolio has several API endpoints:

| Endpoint | Method | What it does |
|----------|--------|--------------|
| `/api/contact` | POST | Sends contact form email |
| `/api/chat` | POST | AI chatbot responses |
| `/api/recommendations` | GET | Get approved recommendations |
| `/api/recommendations` | POST | Submit new recommendation |
| `/api/extensions/stats` | GET | Get Chrome extension user counts |
| `/api/portfolio/projects` | GET | Get all configured projects 🆕 |
| `/api/portfolio/config` | GET | Get full portfolio config 🆕 |

### Test the APIs locally:

```bash
# Test contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","subject":"Hi","message":"Hello"}'

# Test chatbot
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What are your skills?"}'

# Test extension stats
curl http://localhost:3000/api/extensions/stats

# Test portfolio projects
curl http://localhost:3000/api/portfolio/projects
```

---

## 🔐 Environment Variables (Heroku)

Set these in Heroku Config Vars:

### Email Configuration
| Variable | Purpose | Example |
|----------|---------|---------|
| `EMAIL_USER` | SMTP email for sending | manaskumarbehera1@outlook.com |
| `EMAIL_PASS` | SMTP app password | your-app-password |
| `EMAIL_HOST` | SMTP server | smtp-mail.outlook.com |
| `EMAIL_PORT` | SMTP port | 587 |
| `ADMIN_KEY` | Approve recommendations | manas2026 |
| `ASTRATIS_URL` | Analytics API key | (optional) |

### 🆕 Portfolio Data Configuration
| Variable | Purpose | Format |
|----------|---------|--------|
| `PORTFOLIO_PROJECTS` | Configure projects via env | JSON array |
| `CHROME_EXTENSIONS` | Configure extensions via env | JSON array |

**See [PORTFOLIO_DATA.md](PORTFOLIO_DATA.md) for full configuration guide.**

**Quick example:**
```bash
# Set projects
heroku config:set PORTFOLIO_PROJECTS='[{"key":"myproject","name":"My Project","description":"Description","icon":"fas fa-code","tags":["Tag1"],"github":"https://github.com/...","featured":true}]' -a manaskumarbehera

# Set Chrome extensions
heroku config:set CHROME_EXTENSIONS='[{"key":"myext","id":"chrome-extension-id","name":"My Extension","storeUrl":"https://chromewebstore.google.com/..."}]' -a manaskumarbehera
```

**Set a variable:**
```bash
heroku config:set EMAIL_USER=your-email@outlook.com -a manaskumarbehera
```

**View all variables:**
```bash
heroku config -a manaskumarbehera
```

---

## Quick Reference Card

| What | Where |
|------|-------|
| **Live Website** | https://www.manaskumarbehera.com |
| **GitHub Repo** | https://github.com/manaskumarbehera/my-salesforce-portfolio |
| **Heroku App** | manaskumarbehera |
| **Main Branch** | main |
| **Featured Projects** | 4 (from your GitHub) |
| **Local Website** | http://localhost:3000 |

---

## Chrome Extensions

Your portfolio showcases these Chrome extensions with real-time user counts:

| Extension | Chrome Web Store ID |
|-----------|---------------------|
| TrackForce Pro | eombeiphccjbnndbabnkimdlkpaooipk |
| Week Number | hjbeeopedbnpahgbkndkemigkcellibm |
| MetaForce | hclbblgimnkmlmnkekmbclfemhdgmjep |

User counts are fetched automatically and cached for 1 hour.

---

## Need Help?

- **GitHub not saving?** Check your internet connection and try `git push origin main` again
- **Heroku not deploying?** Run `git push heroku main`
- **Errors?** Run `npm test` to check what went wrong
- **Website not working locally?** Make sure you ran `npm start` first
- **Emails not sending?** Check EMAIL_PASS is set correctly in Heroku config

---

*Last updated: February 15, 2026*

