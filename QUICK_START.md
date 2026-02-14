# 📌 Quick Reference Card

## 🚀 Essential Commands

### Local Development
```bash
# Start server (recommended - auto-fixes port conflicts)
./server-manager.sh start

# Or use npm directly
npm start

# Stop server
./server-manager.sh stop
# or Ctrl+C (or Cmd+C on Mac)

# Restart server
./server-manager.sh restart

# Check server status
./server-manager.sh status

# Install dependencies
npm install

# Run setup script
./setup.sh
```

### Heroku Deployment
```bash
# Login to Heroku
heroku login

# Create new app
heroku create your-app-name

# Deploy
git push heroku main

# Open in browser
heroku open

# View logs
heroku logs --tail

# Restart app
heroku restart
```

### Git Commands
```bash
# Initialize repository
git init

# Stage all changes
git add .

# Commit changes
git commit -m "Your message"

# Push to Heroku
git push heroku main

# Check status
git status
```

## 📝 Files to Customize

| File | What to Change | Priority |
|------|---------------|----------|
| `js/main.js` | GitHub username | 🔴 HIGH |
| `index.html` | Name, email, social links | 🔴 HIGH |
| `index.html` | About section, bio | 🟡 MEDIUM |
| `index.html` | Projects & tools | 🟡 MEDIUM |
| `css/style.css` | Colors, styling | 🟢 LOW |

## 🎨 Quick Customizations

### Update GitHub Username
**File:** `js/main.js` (Line 39)
```javascript
const GITHUB_USERNAME = 'YOUR_USERNAME_HERE';
```

### Change Primary Color
**File:** `css/style.css` (Line 2)
```css
--primary-color: #00a1e0;
```

### Update Email
**File:** `index.html` (Search for: `your.email@example.com`)
```html
<a href="mailto:YOUR_EMAIL@example.com">YOUR_EMAIL@example.com</a>
```

### Update Social Links
**File:** `index.html` (Lines 53-62)
```html
<a href="https://github.com/YOUR_USERNAME" ...>
<a href="https://linkedin.com/in/YOUR_PROFILE" ...>
```

## 🌐 Important URLs

- **Local:** http://localhost:3000
- **Heroku:** https://your-app-name.herokuapp.com
- **GitHub API:** https://api.github.com/users/USERNAME/repos

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port in use | `PORT=3001 npm start` |
| GitHub repos not loading | Update `GITHUB_USERNAME` in main.js |
| CSS not updating | Hard refresh: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Win) |
| Heroku deploy fails | `heroku logs --tail` to see errors |
| Server won't start | Check `npm install` was run |

## 📚 Documentation Files

- **PROJECT_SUMMARY.md** - This file! Start here
- **README.md** - Full documentation
- **DEPLOYMENT.md** - Heroku deployment guide  
- **CUSTOMIZATION.md** - Detailed customization help

## ✅ Pre-Deployment Checklist

- [ ] GitHub username updated in `js/main.js`
- [ ] Personal info updated in `index.html`
- [ ] Email addresses changed
- [ ] Social media links updated
- [ ] Projects customized
- [ ] Tested locally (`npm start`)
- [ ] Git initialized and committed
- [ ] Ready to deploy to Heroku!

## 💡 Pro Tips

1. **Test locally first** - Always run `npm start` before deploying
2. **Use incognito mode** - Avoid browser cache issues
3. **Check mobile view** - Use browser dev tools (F12 → Device toolbar)
4. **Keep it updated** - Regularly add new projects
5. **Monitor performance** - Check Heroku logs after deployment

## 🎯 Your Next Steps

1. ✏️ Edit `js/main.js` - Add your GitHub username
2. 📝 Edit `index.html` - Add your personal information
3. 🧪 Test with `npm start` - Visit http://localhost:3000
4. 🚀 Deploy to Heroku - Follow DEPLOYMENT.md
5. 🌐 Add custom domain (optional) - See DEPLOYMENT.md

---

**Need Help?** Check the documentation files or review browser console (F12) for errors.

**Server Running?** Visit http://localhost:3000 to see your portfolio!

