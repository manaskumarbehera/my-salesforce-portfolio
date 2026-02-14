# Configuration Guide 📋

> **A simple guide explaining how everything is set up - no technical jargon!**

---

## What is This Project?

This is your **personal portfolio website** - a website that shows off your skills, projects, and contact information. Think of it like your online resume or business card.

---

## Where Does Your Code Live?

Your code is stored in **two places**:

### 1. GitHub (Your Main Storage) 🏠

**What is it?**  
GitHub is like Google Drive, but for code. It safely stores all your website files and keeps track of every change you make.

**Your GitHub Repository:**  
🔗 https://github.com/manaskumarbehera/my-salesforce-portfolio

**When to use it:**  
- Every time you make changes, they get saved here
- It's your backup - if your computer crashes, your code is safe on GitHub
- Other developers can see your work (great for job applications!)

---

### 2. Heroku (Your Website Host) 🌐

**What is it?**  
Heroku is like a rental space on the internet where your website actually runs. When someone visits your website, they're seeing the version on Heroku.

**Your Heroku App:**  
- **App Name:** `manas-behera-dev`
- **Website URL:** https://manas-behera-dev-5a0040c069c1.herokuapp.com/

**When to use it:**  
- When you want people to see your website online
- Heroku deployment is **optional** - you can push to GitHub without updating Heroku

---

## How the Two Work Together

```
Your Computer  →  GitHub (Storage)  →  Heroku (Live Website)
     ↓                 ↓                      ↓
  You edit      Code is saved         People can visit
  your files    and backed up         your website
```

**Simple workflow:**
1. You make changes on your computer
2. Changes are saved to GitHub (automatic backup)
3. When ready, you deploy to Heroku (makes it live)

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
| `npm run deploy` | Deploys to both GitHub and optionally Heroku |
| `npm test` | Checks if everything is working correctly |

---

### `scripts/deploy.sh` - The Deployment Script

This is an automated helper that:
1. ✅ Checks if you have unsaved changes
2. ✅ Runs tests to make sure nothing is broken
3. ✅ Pushes your code to GitHub
4. ❓ Asks if you also want to update Heroku

**Configuration inside this file:**

```
GitHub Settings:
├── Repository: https://github.com/manaskumarbehera/my-salesforce-portfolio
└── Branch: main

Heroku Settings (Optional):
├── App Name: manas-behera-dev  
└── Website URL: https://manas-behera-dev-5a0040c069c1.herokuapp.com/
```

---

### `js/main.js` - Website Behavior

This file controls how your website works. Key settings:

| Setting | Current Value | What it means |
|---------|---------------|---------------|
| `GITHUB_USERNAME` | `manaskumarbehera` | Your GitHub username for showing your projects |
| Featured Projects | `4` | Shows 4 of your latest GitHub projects on the website |

---

## Git Remotes (Where Code Gets Sent)

Think of "remotes" as different destinations for your code:

| Remote Name | Destination | Purpose |
|-------------|-------------|---------|
| `origin` | GitHub | Main storage (always use this) |
| `heroku` | Heroku | Live website (optional) |

**Current setup:**
- When you "push" code, it goes to **GitHub** by default ✅
- Heroku deployment is **separate** and **optional** ✅

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

### "I want to update my live website"

```bash
npm run deploy
```
This will:
1. Save to GitHub
2. Ask if you want to update Heroku too

---

### "I want to see my live website"

```bash
npm run open
```
Or just visit: https://manas-behera-dev-5a0040c069c1.herokuapp.com/

---

### "Something went wrong, I want to see error logs"

```bash
npm run logs
```

---

## Quick Reference Card

| What | Where |
|------|-------|
| **GitHub Repo** | https://github.com/manaskumarbehera/my-salesforce-portfolio |
| **Live Website** | https://manas-behera-dev-5a0040c069c1.herokuapp.com/ |
| **Heroku App Name** | manas-behera-dev |
| **Main Branch** | main |
| **Featured Projects** | 4 (from your GitHub) |

---

## Need Help?

- **Website not updating?** Make sure you ran `npm run deploy` and said "yes" to Heroku
- **GitHub not saving?** Check your internet connection and try `npm run push` again
- **Errors?** Run `npm run logs` to see what went wrong

---

*Last updated: February 14, 2026*

