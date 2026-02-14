# Complete Deployment Guide - GitHub to Heroku Pipeline

## 🚀 Overview

This guide will help you:
1. Create a GitHub repository for your portfolio
2. Push your code to GitHub
3. Set up automatic deployment from GitHub to Heroku (CI/CD)
4. Every push to GitHub will automatically deploy to Heroku!

**Total Time: ~20 minutes**

---

## Prerequisites

Before starting, ensure you have:
- [ ] GitHub account (create at https://github.com/signup)
- [ ] Heroku account (create at https://signup.heroku.com/)
- [ ] Git installed on your computer
- [ ] Updated your portfolio (GitHub username, email, etc.)

---

## Part 1: Prepare Your Portfolio (5 minutes)

### Step 1: Update Your Information

**Must Update:**

1. **Open `js/main.js`** - Line 39:
   ```javascript
   const GITHUB_USERNAME = 'YOUR_ACTUAL_GITHUB_USERNAME';
   ```

2. **Open `index.html`** - Find and replace:
   - `your.email@example.com` → Your real email
   - `https://github.com/yourusername` → Your GitHub profile URL
   - `https://linkedin.com/in/yourprofile` → Your LinkedIn URL

### Step 2: Test Locally

```bash
cd /Users/manas/IdeaProjects/MyDeveloperProfile
npm start
```

Visit http://localhost:3000 and verify everything looks good.

Press `Ctrl+C` to stop the server when done.

---

## Part 2: Create GitHub Repository (5 minutes)

### Step 1: Create Repository on GitHub

1. **Go to:** https://github.com/new

2. **Repository Settings:**
   - **Repository name:** `my-salesforce-portfolio` (or `manaskumarbehera-portfolio`)
   - **Description:** `Professional Salesforce Developer Portfolio`
   - **Visibility:** Public (so others can see your work!)
   - **DO NOT** initialize with README (we already have files)
   - Click **"Create repository"**

### Step 2: Initialize Local Git Repository

Open terminal and run:

```bash
# Navigate to your project
cd /Users/manas/IdeaProjects/MyDeveloperProfile

# Initialize Git repository
git init

# Set default branch to main
git branch -M main

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Manas Kumar Behera Portfolio"
```

### Step 3: Connect to GitHub

After creating the repository on GitHub, you'll see instructions. Run:

```bash
# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/my-salesforce-portfolio.git

# Push to GitHub
git push -u origin main
```

**Example for Manas:**
```bash
git remote add origin https://github.com/manaskumarbehera/my-salesforce-portfolio.git
git push -u origin main
```

**If prompted for credentials:**
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your GitHub password)
  - Create token at: https://github.com/settings/tokens
  - Select scope: `repo` (full control)
  - Copy the token and use it as password

✅ **Your code is now on GitHub!**

---

## Part 3: Set Up Heroku App (5 minutes)

### Step 1: Install Heroku CLI (if not installed)

**On macOS:**
```bash
brew tap heroku/brew && brew install heroku
```

**On Windows:**
Download from: https://devcenter.heroku.com/articles/heroku-cli

**Verify installation:**
```bash
heroku --version
```

### Step 2: Login to Heroku

```bash
heroku login
```

This will open a browser window. Click "Log in" to authenticate.

### Step 3: Create Heroku App

```bash
# Create app (choose a unique name)
heroku create manaskumarbehera

# Or let Heroku generate a random name
heroku create
```

**If name is taken, try:**
- `manaskumarbehera-portfolio`
- `mkbehera-dev`
- `manas-salesforce-dev`

✅ **Your Heroku app is created!**

**Your app URL:** https://www.manaskumarbehera.com (custom domain configured)

---

## Part 4: Connect GitHub to Heroku (CI/CD Pipeline) (5 minutes)

This is the magic step! Once connected, every push to GitHub automatically deploys to Heroku.

### Method 1: Using Heroku Dashboard (Recommended - Easiest)

1. **Go to Heroku Dashboard:**
   - Visit: https://dashboard.heroku.com/apps
   - Click on your app (`manaskumarbehera`)

2. **Navigate to Deploy Tab:**
   - Click **"Deploy"** tab at the top

3. **Connect to GitHub:**
   - Under "Deployment method", click **"GitHub"**
   - Click **"Connect to GitHub"** button
   - Authorize Heroku to access your GitHub (if first time)

4. **Select Repository:**
   - Search for: `my-salesforce-portfolio`
   - Click **"Connect"** next to your repository

5. **Enable Automatic Deploys:**
   - Scroll to "Automatic deploys" section
   - Select branch: **main**
   - Click **"Enable Automatic Deploys"** button

6. **Deploy Now:**
   - Scroll to "Manual deploy" section
   - Click **"Deploy Branch"** button
   - Wait for build to complete (1-2 minutes)

7. **View Your Site:**
   - Click **"View"** button at the top
   - Or visit: https://www.manaskumarbehera.com

✅ **Pipeline is set up!** Now every push to GitHub will automatically deploy!

### Method 2: Using Heroku CLI (Alternative)

If you prefer command line:

```bash
# Link your Heroku app to GitHub repo
heroku git:remote -a manaskumarbehera

# Set up to deploy from GitHub (requires GitHub Actions)
# Note: Dashboard method is easier for GitHub integration
```

**Recommendation:** Use Method 1 (Dashboard) - it's simpler and more visual.

---

## Part 5: Test Your Pipeline (2 minutes)

Let's test that automatic deployment works!

### Make a Small Change

```bash
# Edit a file (for example, update a comment in index.html)
echo "<!-- Deployed via GitHub Pipeline -->" >> index.html

# Commit the change
git add .
git commit -m "Test automatic deployment"

# Push to GitHub
git push origin main
```

### Watch Automatic Deployment

1. Go to Heroku Dashboard: https://dashboard.heroku.com/apps/manaskumarbehera
2. Click **"Activity"** tab
3. You'll see "Build in progress" - this happens automatically!
4. Wait 1-2 minutes for build to complete
5. Visit your site: https://www.manaskumarbehera.com

🎉 **It works! Your GitHub to Heroku pipeline is live!**

---

## Complete Workflow Summary

**Your new workflow:**

```bash
# 1. Make changes to your portfolio locally
code .

# 2. Test locally
npm start
# Visit http://localhost:3000

# 3. Commit changes
git add .
git commit -m "Updated my portfolio"

# 4. Push to GitHub
git push origin main

# 5. Heroku automatically deploys (no action needed!)
# Wait 1-2 minutes, then visit your site
```

**That's it!** No more manual `git push heroku main` commands!

---

## 🌟 Benefits of GitHub to Heroku Pipeline

✅ **Automatic Deployment** - Push to GitHub, auto-deploys to Heroku  
✅ **Version Control** - Full history of all changes  
✅ **Collaboration Ready** - Others can contribute via Pull Requests  
✅ **Backup** - Your code is safe on GitHub  
✅ **Portfolio Showcase** - GitHub profile shows your projects  
✅ **Easy Rollback** - Revert to previous versions if needed  
✅ **Professional Workflow** - Industry-standard CI/CD practice  

---

## 📋 Complete Setup Checklist

### Initial Setup:
- [ ] Updated GitHub username in `js/main.js`
- [ ] Updated email in `index.html`
- [ ] Updated social media links
- [ ] Tested locally (http://localhost:3000)
- [ ] Created GitHub account
- [ ] Created Heroku account

### GitHub Setup:
- [ ] Created GitHub repository
- [ ] Initialized local Git repository
- [ ] Committed all files
- [ ] Pushed to GitHub
- [ ] Repository is public (so others can see)

### Heroku Setup:
- [ ] Installed Heroku CLI
- [ ] Logged into Heroku
- [ ] Created Heroku app
- [ ] Connected GitHub to Heroku
- [ ] Enabled automatic deploys
- [ ] First deployment successful
- [ ] Site is live and working

### Testing:
- [ ] Made a test change
- [ ] Committed and pushed to GitHub
- [ ] Verified automatic deployment
- [ ] Site updated successfully

---

## 🔧 Common Issues & Solutions

### Issue 1: Git Not Initialized

**Error:** `fatal: not a git repository`

**Solution:**
```bash
cd /Users/manas/IdeaProjects/MyDeveloperProfile
git init
git branch -M main
```

### Issue 2: GitHub Authentication Failed

**Error:** `Authentication failed` or `remote: Invalid username or password`

**Solution:** GitHub no longer accepts passwords. Use Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Name it: `Heroku Portfolio Deploy`
4. Select scope: **`repo`** (full control)
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)
7. Use token as password when pushing to GitHub

**Or use SSH:**
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
# Then use SSH URL instead: git@github.com:username/repo.git
```

### Issue 3: Heroku Build Failed

**Error:** `Build failed` in Heroku dashboard

**Solution:**
```bash
# Check Heroku logs
heroku logs --tail -a manaskumarbehera

# Common fixes:
# 1. Ensure package.json has correct engines
# 2. Check all dependencies are in "dependencies" not "devDependencies"
# 3. Verify Procfile exists and is correct
```

### Issue 4: Port Issue on Heroku

**Error:** Application error, H10 status code

**Solution:** Server must use `process.env.PORT`. This is already correct in `server.js`:
```javascript
const PORT = process.env.PORT || 3000;
```

### Issue 5: Repository Already Exists

**Error:** `repository already exists on GitHub`

**Solution:**
```bash
# If you created repo with README, clone it first
git clone https://github.com/YOUR_USERNAME/my-salesforce-portfolio.git
cd my-salesforce-portfolio

# Copy your files into this directory
cp -r /Users/manas/IdeaProjects/MyDeveloperProfile/* .

# Commit and push
git add .
git commit -m "Add portfolio files"
git push origin main
```

### Issue 6: App Name Taken

**Error:** `Name is already taken`

**Solution:** Try different names:
```bash
heroku create manaskumarbehera-portfolio
# or
heroku create mkbehera-dev
# or
heroku create manas-sf-dev
# or let Heroku generate random name:
heroku create
```

### Issue 7: Automatic Deploy Not Working

**Problem:** Pushing to GitHub but Heroku doesn't deploy

**Solution:**
1. Check Heroku Dashboard → Deploy tab
2. Verify "Enable Automatic Deploys" is ON
3. Check "Activity" tab for build status
4. Manually trigger: Click "Deploy Branch" in Manual Deploy section
5. Check if correct branch is selected (should be `main`)

---

## 🌐 Adding Custom Domain (Optional)

Once your site is live on Heroku, you can add a custom domain.

### Step 1: Buy Domain

See `DOMAIN_SETUP_GUIDE.md` for recommendations.

**Recommended:** `manaskumarbehera.com` from Namecheap (~$10-12/year)

### Step 2: Add Domain to Heroku

```bash
# Add your domain
heroku domains:add www.manaskumarbehera.com -a manaskumarbehera
heroku domains:add manaskumarbehera.com -a manaskumarbehera

# Get DNS target
heroku domains -a manaskumarbehera
```

You'll see something like: `www.manaskumarbehera.com → xxx-123.herokudns.com`

### Step 3: Configure DNS at Domain Registrar

**At Namecheap (or your registrar):**

1. Login to your domain registrar
2. Go to domain management → Advanced DNS
3. Add these records:

**For www subdomain:**
- Type: `CNAME Record`
- Host: `www`
- Value: `xxx-123.herokudns.com` (from heroku domains command)
- TTL: `Automatic` or `3600`

**For root domain:**
- Type: `ALIAS` or `ANAME` or `CNAME` (depends on registrar)
- Host: `@`
- Value: `xxx-123.herokudns.com`
- TTL: `Automatic` or `3600`

**If your registrar doesn't support ALIAS for root domain:**
- Use URL Redirect: `manaskumarbehera.com` → `www.manaskumarbehera.com`

### Step 4: Enable SSL (Free!)

```bash
# Enable automatic SSL certificates
heroku certs:auto:enable -a manaskumarbehera
```

SSL certificates are free and automatically managed by Heroku!

### Step 5: Wait for DNS Propagation

DNS changes take 1-48 hours to propagate worldwide. Usually works in 1-6 hours.

**Check propagation:**
- Visit: https://www.whatsmydns.net
- Enter your domain: `manaskumarbehera.com`
- Select `CNAME` type
- See if it's propagated globally

### Step 6: Visit Your Custom Domain!

After propagation:
- https://www.manaskumarbehera.com
- https://manaskumarbehera.com (if you set up redirect/ALIAS)

---

## 📊 Monitoring Your Site

### View Logs

```bash
# Real-time logs
heroku logs --tail -a manaskumarbehera

# Last 100 lines
heroku logs -n 100 -a manaskumarbehera

# Filter for errors
heroku logs --tail -a manaskumarbehera | grep -i error
```

### Check App Status

```bash
# Dyno status
heroku ps -a manaskumarbehera

# App info
heroku info -a manaskumarbehera
```

### Restart App

```bash
heroku restart -a manaskumarbehera
```

### Check Build History

Visit: https://dashboard.heroku.com/apps/manaskumarbehera/activity

---

## 🔄 Daily Workflow

Once everything is set up, your daily workflow is simple:

```bash
# 1. Work on your portfolio
cd /Users/manas/IdeaProjects/MyDeveloperProfile

# 2. Make changes
# Edit files in your editor

# 3. Test locally
npm start
# Visit http://localhost:3000
# Press Ctrl+C when done

# 4. Commit changes
git add .
git commit -m "Updated about section"

# 5. Push to GitHub
git push origin main

# 6. Wait 1-2 minutes - Heroku auto-deploys!
# 7. Visit your site to see changes live
```

That's it! No manual Heroku deployment commands needed.

---

## 🚀 Advanced: Multiple Environments

Want staging and production environments?

### Create Staging Environment

```bash
# Create staging app
heroku create manas-behera-staging --remote staging

# Connect to GitHub (use Dashboard method)
# Set to auto-deploy from "develop" branch

# Create develop branch
git checkout -b develop
git push origin develop
```

### Create Production Environment

```bash
# Create production app
heroku create manaskumarbehera --remote production

# Connect to GitHub (use Dashboard method)
# Set to auto-deploy from "main" branch
```

### Workflow with Environments

```bash
# Work on develop branch
git checkout develop
# Make changes
git add .
git commit -m "New feature"
git push origin develop
# Auto-deploys to staging

# When ready for production
git checkout main
git merge develop
git push origin main
# Auto-deploys to production
```

---

## 💰 Cost Information

### Free Tier (Perfect for Portfolio!)

**Included:**
- 1000 dyno hours/month (enough for 24/7 with 1 app)
- 512 MB RAM
- Sleeps after 30 min of inactivity (wakes automatically)
- Free SSL certificate
- Custom domain support

**Limitations:**
- App sleeps after 30 min inactivity
- First visit after sleep takes ~10 seconds
- No always-on guarantee

### Hobby Tier ($7/month) - Recommended for Live Portfolio

**Benefits:**
- Always on (no sleeping)
- Better performance
- Metrics dashboard
- Free SSL
- Custom domain
- 512 MB RAM

**Upgrade:**
```bash
heroku dyno:type hobby -a manaskumarbehera
```

---

## 📈 SEO & Performance Tips

### After Deployment:

1. **Submit to Google:**
   - Visit: https://search.google.com/search-console
   - Add your site
   - Submit sitemap

2. **Add Analytics:**
   - See `CUSTOMIZATION.md` for Google Analytics setup

3. **Test Performance:**
   - Visit: https://pagespeed.web.dev
   - Enter your Heroku URL
   - Follow recommendations

4. **Social Media:**
   - Update LinkedIn with your portfolio URL
   - Add to Twitter/X bio
   - Share on dev.to, Medium, etc.

---

## 🎓 Git Best Practices

### Commit Messages

Use clear, descriptive commit messages:

```bash
# Good ✅
git commit -m "Add Salesforce certifications section"
git commit -m "Fix mobile navigation menu bug"
git commit -m "Update project descriptions with latest work"

# Bad ❌
git commit -m "update"
git commit -m "changes"
git commit -m "fix"
```

### Branching Strategy

```bash
# Create feature branch
git checkout -b feature/add-blog-section

# Work on feature
# Make commits

# When done, merge to main
git checkout main
git merge feature/add-blog-section
git push origin main
```

### Keep Repository Clean

```bash
# See what's changed
git status

# See differences
git diff

# Undo changes before commit
git checkout -- filename.html

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

---

## 🆘 Getting Help

**Heroku Issues:**
- Heroku Dev Center: https://devcenter.heroku.com
- Heroku Status: https://status.heroku.com
- Check logs first: `heroku logs --tail`

**GitHub Issues:**
- GitHub Docs: https://docs.github.com
- GitHub Community: https://github.community

**General:**
- Check browser console (F12)
- Review this guide's troubleshooting section
- Search Stack Overflow
- Ask in Salesforce Developer community

---

## ✅ Success Checklist

You're successfully deployed when:

- [ ] Code is on GitHub (public repository)
- [ ] Heroku app is created and running
- [ ] GitHub connected to Heroku
- [ ] Automatic deploys enabled
- [ ] Site loads at Heroku URL
- [ ] GitHub repos display correctly on site
- [ ] All links work
- [ ] Mobile view looks good
- [ ] Test push triggers auto-deploy
- [ ] (Optional) Custom domain configured
- [ ] (Optional) SSL enabled

---

## 🎉 Congratulations!

Your portfolio is now live with professional CI/CD pipeline!

**Your URLs:**
- **GitHub Repo:** https://github.com/manaskumarbehera/MyDeveloperProfile
- **Live Site:** https://www.manaskumarbehera.com
- **Heroku App:** https://manaskumarbehera-0a839944011b.herokuapp.com

**Next Steps:**
1. Share your portfolio URL on LinkedIn
2. Add to your resume
3. Share in Salesforce communities
4. Keep updating with new projects

---

**Your portfolio is ready to impress! 🚀**

Every push to GitHub now automatically deploys to Heroku - that's professional DevOps!

Share your portfolio with the world and show off your Salesforce development skills!

