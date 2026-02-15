# Salesforce Developer Portfolio

A professional portfolio website showcasing Salesforce development projects, tools, and expertise. Designed to be hosted on Heroku with custom domain support.

## 🌟 Live Demo

**Website:** [manaskumarbehera.com](https://www.manaskumarbehera.com)

## 📚 Documentation

**All guides are in the `docs/` directory.**

### 🎯 Essential Guides
- **[START_HERE.md](docs/START_HERE.md)** ⭐ - Quick setup in 5 minutes
- **[INTELLIJ.md](docs/INTELLIJ.md)** - IntelliJ one-click commands
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Deploy to Heroku
- **[API.md](docs/API.md)** - Complete API reference 🆕
- **[TESTING.md](docs/TESTING.md)** - Testing guide
- **[TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Fix common issues
- **[CUSTOMIZATION.md](docs/CUSTOMIZATION.md)** - Customize your portfolio

**→ Full documentation index: [docs/README.md](docs/README.md)**

## ⚡ IntelliJ One-Click Commands

**New! Run everything from IntelliJ's top-right dropdown:**

| Command | Purpose | Shortcut |
|---------|---------|----------|
| `npm: Start Server` | Start development server | Ctrl+Shift+R → Select |
| `npm: Test` | Run all tests (52 tests) | Ctrl+Shift+R → Select |
| `npm: Test Coverage` | Tests + coverage report | Ctrl+Shift+R → Select |
| `npm: Validate` | Syntax validation | Ctrl+Shift+R → Select |
| `npm: Commit` | Git commit workflow | Ctrl+Shift+R → Select |
| `npm: Build` | Build project | Ctrl+Shift+R → Select |
| `npm: Deploy` | Deploy to Heroku | Ctrl+Shift+R → Select |
| `npm: Release` | **All-in-one deployment** | Ctrl+Shift+R → Select |

**See:** [INTELLIJ.md](docs/INTELLIJ.md) for details.

## 🚀 Features

### Core Features
- **Responsive Design**: Mobile-friendly layout using Bootstrap 5
- **GitHub Integration**: Automatically displays your latest repositories
- **Project Showcase**: Highlight your Salesforce tools and Chrome extensions
- **Skills Section**: Display your technical expertise
- **Contact Form**: Email notifications with auto-reply
- **SEO Optimized**: Meta tags and semantic HTML
- **Fast Loading**: Compressed assets and optimized delivery

### 🆕 New Features (2026)

#### 🤖 AI Chatbot
- Interactive chatbot assistant on the portfolio
- Answers questions about skills, projects, and contact info
- Supports Astratis AI integration with local fallback
- Quick reply buttons for common queries

#### ⭐ Recommendations System
- Visitors can submit recommendations/testimonials
- Admin approval workflow via email
- Star rating system (1-5 stars)
- LinkedIn profile integration

#### 📊 Chrome Extension Stats API
- Real-time user count from Chrome Web Store
- Displays stats for all published extensions:
  - **TrackForce Pro** - Audit trail analysis
  - **Week Number** - Week number display
  - **MetaForce** - Metadata management
- Auto-caching (1 hour) to prevent rate limiting

#### 📈 Analytics Dashboard
- Page view tracking
- Visitor counting
- Project & tool click tracking
- Astratis Global Analytics integration

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/contact` | POST | Submit contact form (sends email) |
| `/api/chat` | POST | Chat with AI assistant |
| `/api/recommendations` | GET | Get approved recommendations |
| `/api/recommendations` | POST | Submit new recommendation |
| `/api/portfolio/projects` | GET | Get all projects (from config) 🆕 |
| `/api/portfolio/projects/featured` | GET | Get featured projects only 🆕 |
| `/api/portfolio/config` | GET | Get full portfolio config 🆕 |
| `/api/extensions/stats` | GET | Get all Chrome extension user counts |
| `/api/extensions/:key/stats` | GET | Get single extension stats |

### 🆕 Configuration via Environment Variables

Projects and Chrome extensions can now be configured via environment variables for easy updates without code changes:

```bash
# Set projects via environment variable
heroku config:set PORTFOLIO_PROJECTS='[{"key":"myproject","name":"My Project","description":"Description","icon":"fas fa-code","tags":["Tag1"],"github":"https://github.com/...","featured":true}]'

# Set Chrome extensions
heroku config:set CHROME_EXTENSIONS='[{"key":"myextension","id":"chrome-extension-id","name":"My Extension","storeUrl":"https://chromewebstore.google.com/..."}]'
```

**Full Configuration Guide:** [docs/PORTFOLIO_DATA.md](docs/PORTFOLIO_DATA.md)

### Example: Get Extension Stats
```bash
curl https://www.manaskumarbehera.com/api/extensions/stats
```

Response:
```json
{
  "success": true,
  "data": {
    "extensions": {
      "trackforcepro": { "name": "TrackForce Pro", "users": 9 },
      "weeknumber": { "name": "Week Number", "users": 332 },
      "metaforce": { "name": "MetaForce", "users": 54 }
    },
    "totalUsers": 395,
    "fetchedAt": "2026-02-15T06:15:03.789Z"
  }
}
```

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Backend**: Node.js, Express.js
- **Icons**: Font Awesome 6
- **Email**: Nodemailer (supports SMTP & custom domain)
- **Security**: Helmet.js, CSP Headers, Rate Limiting
- **Scraping**: Axios, Cheerio (for Chrome Web Store)
- **Analytics**: Astratis Global (optional)
- **Hosting**: Heroku with custom domain

## 📧 Email Configuration

The portfolio supports sending emails from your custom domain. Two modes available:

| Mode | Description | Best For |
|------|-------------|----------|
| `smtp` | Real mailbox (Google Workspace/M365/Zoho) | Production use |
| `forward_only` | Uses personal email as From | Quick setup |

**Quick Setup:**
```bash
heroku config:set EMAIL_MODE=smtp -a manaskumarbehera
heroku config:set EMAIL_HOST=smtp.gmail.com -a manaskumarbehera
heroku config:set EMAIL_PORT=587 -a manaskumarbehera
heroku config:set EMAIL_USER=your-email -a manaskumarbehera
heroku config:set EMAIL_PASS=your-app-password -a manaskumarbehera
heroku config:set EMAIL_TO=your-notification-email -a manaskumarbehera
```

**Full Guide:** [docs/EMAIL_SETUP.md](docs/EMAIL_SETUP.md)

## 📦 Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/developer-portfolio.git
   cd developer-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure GitHub username**
   - Open `js/main.js`
   - Update the `GITHUB_USERNAME` constant with your GitHub username

4. **Run locally**
   ```bash
   npm start
   ```
   Visit `http://localhost:3000` in your browser

## 🌐 Deploy to Heroku

### Prerequisites
- Heroku account ([sign up here](https://signup.heroku.com/))
- Heroku CLI installed ([download here](https://devcenter.heroku.com/articles/heroku-cli))
- Git installed

### Deployment Steps

1. **Login to Heroku**
   ```bash
   heroku login
   ```

2. **Create a new Heroku app**
   ```bash
   heroku create your-portfolio-name
   ```

3. **Initialize Git repository (if not already done)**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

4. **Deploy to Heroku**
   ```bash
   git push heroku main
   ```
   
   If your default branch is `master`:
   ```bash
   git push heroku master
   ```

5. **Open your app**
   ```bash
   heroku open
   ```

### Add Custom Domain (Optional)

1. **Add your custom domain to Heroku**
   ```bash
   heroku domains:add www.yourdomain.com
   ```

2. **Get the DNS target**
   ```bash
   heroku domains
   ```

3. **Configure your DNS provider**
   - Add a CNAME record pointing to the Heroku DNS target
   - Example: `www.yourdomain.com` → `your-app-name.herokuapp.com`

4. **For root domain, use DNS provider's ALIAS or ANAME record**
   ```bash
   heroku domains:add yourdomain.com
   ```

## ⚙️ Configuration

### Environment Variables (Heroku Config Vars)

| Variable | Description | Required |
|----------|-------------|----------|
| `EMAIL_USER` | SMTP email address (Outlook) | Yes |
| `EMAIL_PASS` | SMTP password/app password | Yes |
| `EMAIL_HOST` | SMTP host (default: smtp-mail.outlook.com) | No |
| `EMAIL_PORT` | SMTP port (default: 587) | No |
| `ADMIN_KEY` | Admin key for approving recommendations | No |
| `ASTRATIS_URL` | Astratis AI API key | No |

### Set Environment Variables on Heroku
```bash
heroku config:set EMAIL_USER=your-email@outlook.com -a manaskumarbehera
heroku config:set EMAIL_PASS=your-app-password -a manaskumarbehera
```

### Update Personal Information

Edit `index.html` to update:
- Your name and title
- Email address
- LinkedIn, GitHub, Trailblazer profile links
- About section content
- Statistics

### Update Projects

Edit `index.html` to modify the featured projects section with your actual projects:
- Project names
- Descriptions
- Technologies used
- GitHub repository links
- Live demo links

### Customize Styling

Edit `css/style.css` to:
- Change color scheme (modify CSS variables in `:root`)
- Adjust layout and spacing
- Customize animations

### GitHub Repositories

The site automatically fetches and displays your GitHub repositories. Configure in `js/main.js`:
- `GITHUB_USERNAME`: Your GitHub username
- `EXCLUDED_REPOS`: Array of repo names to exclude
- Number of repos to display (default: 6)

## 📧 Contact Form Integration

The contact form is ready to integrate with backend services. Options include:

### Option 1: EmailJS
1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Add EmailJS SDK to index.html
3. Update the form submission handler in `js/main.js`

### Option 2: Formspree
1. Sign up at [Formspree](https://formspree.io/)
2. Update form action attribute
3. No JavaScript changes needed

### Option 3: Custom Backend
Uncomment and configure the fetch API call in `js/main.js` to send to your backend endpoint.

## 🔒 Security

- Helmet.js for security headers
- Content Security Policy configured
- Input validation on contact form
- Environment variables for sensitive data

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

Feel free to fork this repository and customize it for your own portfolio!

## 📄 License

MIT License - feel free to use this template for your own portfolio.

## 📞 Support

If you have questions or need help with deployment, feel free to open an issue.

## 🎨 Customization Tips

1. **Change Primary Color**: Update `--primary-color` in `css/style.css`
2. **Add New Sections**: Copy existing section structure in `index.html`
3. **Add Analytics**: Insert Google Analytics or other tracking code in `index.html`
4. **Add Blog**: Create a new section and link to your blog platform
5. **Add Certifications**: Create a new section showcasing Salesforce certifications

## 🚀 Performance

- Lighthouse Score: 95+
- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- Compressed assets with gzip
- Lazy loading for images (when implemented)

## 📊 Monitoring

To monitor your Heroku app:
```bash
heroku logs --tail
heroku ps
```

## 🔄 Updates

To update your deployed site:
```bash
git add .
git commit -m "Update description"
git push heroku main
```

---

**Built with ❤️ for Salesforce Developers**

