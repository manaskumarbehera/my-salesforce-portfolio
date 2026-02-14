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

## Advanced Configuration

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

