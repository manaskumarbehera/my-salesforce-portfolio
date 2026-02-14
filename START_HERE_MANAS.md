# 🚀 Quick Start Guide for Manas Kumar Behera

## ✅ Your Portfolio is Ready!

**Your Name:** Manas Kumar Behera  
**Server Running:** http://localhost:3000  
**Recommended App Name:** `manas-behera-dev`  
**Recommended Domain:** `manaskumarbehera.com`

---

## 🎯 Your Next 3 Steps (15 Minutes Total)

### **Step 1: Add Your GitHub Username (2 minutes)**

Open this file: `js/main.js`

Find line 39 and change:
```javascript
const GITHUB_USERNAME = 'yourusername';
```

To:
```javascript
const GITHUB_USERNAME = 'YOUR_ACTUAL_GITHUB_USERNAME';
```

**Save the file** and refresh http://localhost:3000 - your GitHub repos will now load!

---

### **Step 2: Update Your Contact Information (5 minutes)**

Open this file: `index.html`

**Find and replace these:**

1. **Email address** (appears multiple times):
   - Search for: `your.email@example.com`
   - Replace with: `your-real-email@gmail.com` (or your actual email)

2. **GitHub URL** (appears multiple times):
   - Search for: `https://github.com/yourusername`
   - Replace with: `https://github.com/YOUR_USERNAME`

3. **LinkedIn URL** (appears multiple times):
   - Search for: `https://linkedin.com/in/yourprofile`
   - Replace with: `https://linkedin.com/in/YOUR_LINKEDIN_ID`

4. **Trailblazer URL** (optional, if you have one):
   - Search for: `https://trailblazer.me/id/yourprofile`
   - Replace with: Your actual Trailblazer profile URL

**Tip:** Use "Find and Replace" in your editor (Cmd+F or Ctrl+F)

---

### **Step 3: Deploy to Heroku via GitHub (10 minutes)**

#### 3a. Create GitHub Repository

1. **Go to:** https://github.com/new
2. **Repository name:** `my-salesforce-portfolio` or `manaskumarbehera-portfolio`
3. **Visibility:** Public
4. **DO NOT** check "Initialize with README"
5. Click **"Create repository"**

#### 3b. Push Code to GitHub

Open terminal and run:

```bash
# Navigate to your project
cd /Users/manas/IdeaProjects/MyDeveloperProfile

# Initialize Git
git init
git branch -M main
git add .
git commit -m "Initial commit - Manas Behera Portfolio"

# Connect to GitHub (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/my-salesforce-portfolio.git

# Push to GitHub
git push -u origin main
```

**If prompted for password:** Use a Personal Access Token from https://github.com/settings/tokens

#### 3c. Create Heroku App

```bash
# Login to Heroku (will open browser)
heroku login

# Create your Heroku app
heroku create manas-behera-dev
```

#### 3d. Connect GitHub to Heroku (Dashboard - Easiest!)

1. **Go to:** https://dashboard.heroku.com/apps/manas-behera-dev
2. Click **"Deploy"** tab
3. Under "Deployment method", click **"GitHub"**
4. Click **"Connect to GitHub"** and authorize
5. Search for your repository: `my-salesforce-portfolio`
6. Click **"Connect"**
7. Scroll to "Automatic deploys" → Select branch **main**
8. Click **"Enable Automatic Deploys"**
9. Scroll to "Manual deploy" → Click **"Deploy Branch"**
10. Wait 1-2 minutes → Click **"View"**

**Your site is now live at:** https://manas-behera-dev.herokuapp.com

**🎉 From now on, every push to GitHub will automatically deploy to Heroku!**

---

## 🌐 Buying Your Custom Domain

### **Recommended Domain:** `manaskumarbehera.com`

**Best Place to Buy:** Namecheap.com

**Steps:**
1. Go to: https://www.namecheap.com
2. Search for: `manaskumarbehera.com`
3. If available: Click "Add to Cart" ($10-12/year)
4. Create account and checkout
5. Enable WhoisGuard (free privacy protection)

**Alternative if taken:**
- `manaskumarbehera.dev` (great for developers!)
- `manasbehera.com`
- `mkbehera.com`

**See full guide:** Open `DOMAIN_SETUP_GUIDE.md` in your project folder

---

## 🎨 Optional: Customize Content (Later)

Once your site is live, you can customize these sections in `index.html`:

1. **About Me** (Line ~78-80)
   - Write your personal story
   - Your experience and skills
   - What makes you unique

2. **Statistics** (Line ~81-96)
   - Update numbers to match your experience
   - Projects completed
   - Years of experience

3. **Skills** (Line ~106-176)
   - Add/remove skills based on your expertise
   - Reorder by proficiency

4. **Projects** (Line ~189-223)
   - Replace with your actual projects
   - Add real GitHub links
   - Update descriptions

5. **Tools** (Line ~234-326)
   - Showcase your developer tools
   - Update descriptions
   - Add repository links

---

## 📝 Important Files Reference

| File | What to Edit | Priority |
|------|-------------|----------|
| `js/main.js` (line 39) | GitHub username | 🔴 MUST DO |
| `index.html` | Email & social links | 🔴 MUST DO |
| `index.html` | About section | 🟡 SHOULD DO |
| `index.html` | Projects & skills | 🟡 SHOULD DO |
| `css/style.css` | Colors & styling | 🟢 OPTIONAL |

---

## 🎯 Your Personalized Commands

### Start Server
```bash
cd /Users/manas/IdeaProjects/MyDeveloperProfile
npm start
```
Then visit: http://localhost:3000

### Stop Server
Press `Ctrl+C` in the terminal

### Deploy to Heroku (via GitHub)
```bash
cd /Users/manas/IdeaProjects/MyDeveloperProfile

# Make your changes, then:
git add .
git commit -m "Update portfolio"
git push origin main

# Heroku automatically deploys from GitHub!
# Wait 1-2 minutes, then visit your site
```

### View Heroku Logs
```bash
heroku logs --tail
```

### Add Custom Domain (After Purchasing)
```bash
heroku domains:add www.manaskumarbehera.com
heroku domains:add manaskumarbehera.com
heroku domains  # Get DNS target
```

---

## ✅ Checklist Before Going Live

- [ ] Updated GitHub username in `js/main.js`
- [ ] Changed email to your real email
- [ ] Updated LinkedIn URL
- [ ] Updated GitHub URL
- [ ] Tested locally at http://localhost:3000
- [ ] GitHub repos are loading correctly
- [ ] All links work (clicked each one)
- [ ] Checked mobile view (F12 → device toolbar)
- [ ] Deployed to Heroku successfully
- [ ] Site opens at Heroku URL

---

## 🆘 Quick Troubleshooting

**Problem:** GitHub repos not loading  
**Solution:** Update `GITHUB_USERNAME` in `js/main.js` (line 39)

**Problem:** CSS changes not showing  
**Solution:** Hard refresh browser (Cmd+Shift+R on Mac)

**Problem:** Port 3000 already in use  
**Solution:** Run `PORT=3001 npm start`

**Problem:** Heroku deployment fails  
**Solution:** Check logs with `heroku logs --tail`

---

## 📚 Documentation Files

All detailed guides are in your project folder:

- **DOMAIN_SETUP_GUIDE.md** - Domain purchasing guide (just created for you!)
- **QUICK_START.md** - General quick reference
- **DEPLOYMENT.md** - Detailed Heroku deployment
- **CUSTOMIZATION.md** - How to customize everything
- **WEBSITE_PREVIEW.md** - What each section contains
- **DOCUMENTATION_INDEX.md** - Guide to all docs

---

## 🎉 You're Ready, Manas!

Your portfolio website is set up and ready to launch!

**Current Status:**
- ✅ Website created with your name
- ✅ Server running at http://localhost:3000
- ✅ Ready to add your GitHub username
- ✅ Ready to deploy to Heroku

**Your URLs:**
- **Local:** http://localhost:3000
- **Heroku:** https://manas-behera-dev.herokuapp.com (after deployment)
- **Custom Domain:** https://www.manaskumarbehera.com (after setup)

---

## 💡 Pro Tips

1. **Test locally first** - Make sure everything works before deploying
2. **Use real data** - Replace all placeholder content with your actual info
3. **Check mobile** - Open http://localhost:3000 on your phone
4. **Start simple** - Deploy basic version first, then enhance
5. **Update regularly** - Keep adding new projects and skills

---

## 🚀 Let's Go!

**Right Now:** Visit http://localhost:3000 to see your portfolio!

**Next:** Update `js/main.js` with your GitHub username

**Then:** Deploy to Heroku and share with the world!

Good luck! 🎉

---

**Questions?** Check the documentation files or reach out to the Salesforce developer community!

