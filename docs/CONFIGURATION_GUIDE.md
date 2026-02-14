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

## Quick Reference Card

| What | Where |
|------|-------|
| **GitHub Repo** | https://github.com/manaskumarbehera/my-salesforce-portfolio |
| **Main Branch** | main |
| **Featured Projects** | 4 (from your GitHub) |
| **Local Website** | http://localhost:3000 |

---

## Need Help?

- **GitHub not saving?** Check your internet connection and try `npm run push` again
- **Errors?** Run `npm test` to check what went wrong
- **Website not working locally?** Make sure you ran `npm start` first

---

*Last updated: February 14, 2026*

