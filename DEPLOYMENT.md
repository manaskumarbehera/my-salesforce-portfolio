# Heroku Deployment Guide

## Quick Start Deployment

### Step 1: Prepare Your Repository

1. **Initialize Git (if not already done)**
   ```bash
   cd /Users/manas/IdeaProjects/MyDeveloperProfile
   git init
   ```

2. **Update Your Information**
   - Edit `index.html`: Update name, email, social links
   - Edit `js/main.js`: Change `GITHUB_USERNAME` to your GitHub username
   - Replace placeholder content with your actual information

3. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Initial portfolio setup"
   ```

### Step 2: Install Heroku CLI

**On macOS:**
```bash
brew tap heroku/brew && brew install heroku
```

**Or download from:** https://devcenter.heroku.com/articles/heroku-cli

### Step 3: Login to Heroku

```bash
heroku login
```

This will open a browser window for authentication.

### Step 4: Create Heroku App

```bash
heroku create your-portfolio-name
```

Replace `your-portfolio-name` with your desired app name. If name is taken, Heroku will suggest an alternative.

**Note:** Your app will be available at `https://your-portfolio-name.herokuapp.com`

### Step 5: Deploy to Heroku

```bash
git push heroku main
```

If your default branch is `master`:
```bash
git push heroku master
```

### Step 6: Open Your App

```bash
heroku open
```

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
heroku logs --tail -a manas-behera-dev

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
heroku domains:add www.manaskumarbehera.com -a manas-behera-dev
heroku domains:add manaskumarbehera.com -a manas-behera-dev

# Get DNS target
heroku domains -a manas-behera-dev
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
heroku certs:auto:enable -a manas-behera-dev
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
heroku logs --tail -a manas-behera-dev

# Last 100 lines
heroku logs -n 100 -a manas-behera-dev

# Filter for errors
heroku logs --tail -a manas-behera-dev | grep -i error
```

### Check App Status

```bash
# Dyno status
heroku ps -a manas-behera-dev

# App info
heroku info -a manas-behera-dev
```

### Restart App

```bash
heroku restart -a manas-behera-dev
```

### Check Build History

Visit: https://dashboard.heroku.com/apps/manas-behera-dev/activity

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
heroku create manas-behera-dev --remote production

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
heroku dyno:type hobby -a manas-behera-dev
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
- **GitHub Repo:** https://github.com/YOUR_USERNAME/my-salesforce-portfolio
- **Live Site:** https://manas-behera-dev.herokuapp.com
- **Custom Domain:** https://www.manaskumarbehera.com (after setup)

**Next Steps:**
1. Share your portfolio URL on LinkedIn
2. Add to your resume
3. Share in Salesforce communities
4. Keep updating with new projects
5. Consider buying custom domain

---

**Your portfolio is ready to impress! 🚀**

Every push to GitHub now automatically deploys to Heroku - that's professional DevOps! 

Share your portfolio with the world and show off your Salesforce development skills!

### Adding Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set GITHUB_TOKEN=your_token_here
```

View current config:
```bash
heroku config
```

### Adding a Custom Domain

1. **Add domain to Heroku**
   ```bash
   heroku domains:add www.yourdomain.com
   ```

2. **Get DNS target**
   ```bash
   heroku domains
   ```

3. **Configure DNS Provider**
   - Go to your domain registrar (GoDaddy, Namecheap, etc.)
   - Add CNAME record:
     - Host: `www`
     - Points to: `your-app-name.herokuapp.com`
     - TTL: 3600 (or default)

4. **For root domain (yourdomain.com)**
   ```bash
   heroku domains:add yourdomain.com
   ```
   
   Add ALIAS or ANAME record at your DNS provider pointing to the DNS target from step 2.

### SSL Certificate (Free with Custom Domain)

Heroku automatically provisions SSL certificates for custom domains:
```bash
heroku certs:auto:enable
```

### Monitoring Your App

**View logs:**
```bash
heroku logs --tail
```

**Check app status:**
```bash
heroku ps
```

**Restart app:**
```bash
heroku restart
```

### Scaling Your App

Free tier:
```bash
heroku ps:scale web=1
```

Upgrade dyno type:
```bash
heroku ps:type hobby
```

## Troubleshooting

### Build Fails

1. Check Node version in `package.json` matches installed version
2. Ensure all dependencies are in `dependencies`, not `devDependencies`
3. Check build logs: `heroku logs --tail`

### App Crashes

```bash
heroku logs --tail
heroku restart
```

### Port Issues

Heroku assigns the port dynamically. The code already handles this with:
```javascript
const PORT = process.env.PORT || 3000;
```

### GitHub API Rate Limiting

If you're hitting GitHub API limits, create a personal access token:
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with `public_repo` scope
3. Add to Heroku: `heroku config:set GITHUB_TOKEN=your_token`
4. Update `server.js` to use the token in GitHub API requests

## CI/CD with GitHub

### Connect GitHub to Heroku

1. Go to Heroku Dashboard
2. Select your app
3. Click "Deploy" tab
4. Choose "GitHub" as deployment method
5. Connect your repository
6. Enable "Automatic deploys" from main branch

Now every push to GitHub will automatically deploy!

## Backup and Database (Future)

If you add a database later:
```bash
heroku addons:create heroku-postgresql:mini
heroku pg:backups:schedule --at '02:00 America/New_York'
```

## Custom Buildpacks (Advanced)

The app uses Node.js buildpack by default. To add more:
```bash
heroku buildpacks:add heroku/nodejs
```

## Performance Optimization

### Enable Compression
Already implemented in `server.js` with compression middleware.

### Add Caching Headers
Already configured in `server.js` with `maxAge: '1d'`.

### Monitor Performance
```bash
heroku plugins:install heroku-metrics
heroku metrics
```

## Cost Estimates

- **Free Tier**: Perfect for portfolio (sleeps after 30 min inactivity)
- **Hobby ($7/month)**: Always on, custom domain, SSL
- **Professional ($25+/month)**: Multiple dynos, metrics

## Going Live Checklist

- [ ] Update all personal information in HTML
- [ ] Set GitHub username in main.js
- [ ] Test locally: `npm start`
- [ ] Add actual project descriptions and links
- [ ] Update email in contact section
- [ ] Configure contact form backend (if needed)
- [ ] Test on mobile devices
- [ ] Add Google Analytics (optional)
- [ ] Set up custom domain
- [ ] Test SSL certificate
- [ ] Share on LinkedIn/Twitter!

## Updating Your Site

After making changes locally:
```bash
git add .
git commit -m "Description of changes"
git push heroku main
```

## Support Resources

- [Heroku Dev Center](https://devcenter.heroku.com/)
- [Heroku Status](https://status.heroku.com/)
- [Node.js Buildpack](https://devcenter.heroku.com/articles/nodejs-support)
- [Custom Domains](https://devcenter.heroku.com/articles/custom-domains)

## Next Steps

1. Deploy your basic site first
2. Test everything works on Heroku
3. Gradually add more features
4. Consider adding:
   - Blog integration
   - Project case studies
   - Testimonials section
   - Resume download
   - Certification badges

---

**Need Help?** Check Heroku logs first: `heroku logs --tail`

