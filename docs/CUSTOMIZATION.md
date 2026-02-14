# Customization Guide

## Quick Customization Checklist

### 1. Personal Information (index.html)

**Line 24-26: Navigation Brand**
```html
<a class="navbar-brand" href="#home">
    <i class="fab fa-salesforce"></i> Your Name
</a>
```

**Line 44-46: Hero Section Title**
```html
<h1 class="display-3 fw-bold mb-4">Your Name</h1>
<p class="lead mb-4">Your tagline/description</p>
```

**Line 53-62: Social Media Links**
```html
<a href="https://github.com/YOURUSERNAME" target="_blank" class="social-icon">
<a href="https://linkedin.com/in/YOURPROFILE" target="_blank" class="social-icon">
<a href="https://trailblazer.me/id/YOURPROFILE" target="_blank" class="social-icon">
```

**Line 78-80: About Section**
Update the paragraph text with your own story and experience.

**Line 81-96: Statistics**
```html
<h3 class="stat-number">50+</h3>
<p class="stat-label">Projects Completed</p>
```
Change numbers and labels to match your experience.

**Line 270-274: Contact Email**
```html
<a href="mailto:YOUR.EMAIL@example.com">your.email@example.com</a>
```

### 2. GitHub Configuration (js/main.js)

**Line 39: GitHub Username**
```javascript
const GITHUB_USERNAME = 'yourusername'; // Replace with your actual GitHub username
```

**Line 40: Exclude Repositories**
```javascript
const EXCLUDED_REPOS = ['yourusername', 'private-repo']; // Add repos to hide
```

### 3. Projects Section (index.html)

**Lines 186-279: Featured Projects (4 projects)**

Update each project card with your actual projects:

```html
<h4>Your Project Name</h4>
<p>Your project description...</p>
<div class="project-tags">
    <span class="badge bg-primary">Technology 1</span>
    <span class="badge bg-secondary">Technology 2</span>
</div>
<div class="project-links mt-3">
    <a href="YOUR_GITHUB_REPO_URL" class="btn btn-sm btn-outline-primary">
        <i class="fab fa-github"></i> View Code
    </a>
    <a href="YOUR_LIVE_DEMO_URL" class="btn btn-sm btn-outline-success">
        <i class="fas fa-external-link-alt"></i> Live Demo
    </a>
</div>
```

### 4. Skills Section (index.html)

**Lines 106-176: Update Skills**

Modify the skill cards to reflect your actual skills:

```html
<div class="skill-card">
    <div class="skill-icon">
        <i class="fab fa-salesforce"></i>
    </div>
    <h4>Category Name</h4>
    <ul class="skill-list">
        <li>Skill 1</li>
        <li>Skill 2</li>
        <li>Skill 3</li>
    </ul>
</div>
```

### 5. Tools Section (index.html)

**Lines 234-326: Update Tools**

Customize your developer tools:

```html
<div class="tool-card">
    <div class="tool-header">
        <i class="fas fa-terminal"></i>
        <h4>Tool Name</h4>
    </div>
    <p>Tool description...</p>
    <ul class="tool-features">
        <li><i class="fas fa-check"></i> Feature 1</li>
        <li><i class="fas fa-check"></i> Feature 2</li>
    </ul>
    <a href="GITHUB_REPO_URL" class="btn btn-primary">
        <i class="fab fa-github"></i> View on GitHub
    </a>
</div>
```

## Color Scheme Customization

Edit `css/style.css` at the top:

```css
:root {
    --primary-color: #00a1e0;      /* Salesforce Blue */
    --secondary-color: #032d60;    /* Dark Blue */
    --dark-color: #16325c;         /* Navy */
    --light-color: #f4f6f9;        /* Light Gray */
    --text-color: #333;            /* Text */
    --border-radius: 8px;          /* Corner Radius */
}
```

### Popular Color Schemes

**Professional Blue:**
```css
--primary-color: #0066cc;
--secondary-color: #003d7a;
```

**Modern Purple:**
```css
--primary-color: #7c3aed;
--secondary-color: #5b21b6;
```

**Tech Green:**
```css
--primary-color: #10b981;
--secondary-color: #059669;
```

**Orange/Red:**
```css
--primary-color: #f97316;
--secondary-color: #ea580c;
```

## Adding New Sections

### Template for New Section

Add this anywhere between existing sections in `index.html`:

```html
<section id="new-section" class="section-padding">
    <div class="container">
        <h2 class="section-title text-center mb-5">Section Title</h2>
        <div class="row">
            <div class="col-lg-8 mx-auto">
                <!-- Your content here -->
                <p>Section content...</p>
            </div>
        </div>
    </div>
</section>
```

Don't forget to add navigation link:
```html
<li class="nav-item"><a class="nav-link" href="#new-section">New Section</a></li>
```

### Example: Certifications Section

```html
<section id="certifications" class="section-padding bg-light">
    <div class="container">
        <h2 class="section-title text-center mb-5">Certifications</h2>
        <div class="row">
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="cert-card text-center">
                    <i class="fas fa-certificate fa-3x text-primary mb-3"></i>
                    <h4>Salesforce Certified Platform Developer I</h4>
                    <p class="text-muted">Earned: January 2024</p>
                </div>
            </div>
            <!-- Add more certification cards -->
        </div>
    </div>
</section>
```

Add to CSS:
```css
.cert-card {
    background: white;
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease;
}

.cert-card:hover {
    transform: translateY(-10px);
}
```

## Adding Google Analytics

Add before closing `</head>` tag in `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Adding Blog Link

If you have a blog (Medium, Dev.to, etc.):

```html
<li class="nav-item"><a class="nav-link" href="https://yourblog.com" target="_blank">Blog</a></li>
```

## Font Customization

### Using Google Fonts

Add to `<head>` in `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Update in `css/style.css`:
```css
body {
    font-family: 'Inter', sans-serif;
}
```

## Icon Customization

Current icons are from Font Awesome 6. Browse more at: https://fontawesome.com/icons

Change any icon:
```html
<i class="fas fa-code"></i>  <!-- Solid style -->
<i class="fab fa-github"></i>  <!-- Brand style -->
<i class="far fa-heart"></i>  <!-- Regular style -->
```

## Adding Resume Download

Add button in hero section:
```html
<a href="resume.pdf" download class="btn btn-outline-light btn-lg">
    <i class="fas fa-download"></i> Download Resume
</a>
```

Place `resume.pdf` in root directory.

## Testimonials Section

```html
<section id="testimonials" class="section-padding">
    <div class="container">
        <h2 class="section-title text-center mb-5">Testimonials</h2>
        <div class="row">
            <div class="col-md-6 mb-4">
                <div class="testimonial-card">
                    <p>"Quote from client or colleague..."</p>
                    <div class="testimonial-author">
                        <strong>John Doe</strong>
                        <span class="text-muted">Company Name</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
```

CSS:
```css
.testimonial-card {
    background: white;
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    border-left: 4px solid var(--primary-color);
}

.testimonial-author {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
}
```

## Contact Form Integration

### Option 1: Formspree (Easiest)

1. Sign up at https://formspree.io
2. Replace form in index.html:

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
    <input type="text" name="name" placeholder="Your Name" required>
    <input type="email" name="email" placeholder="Your Email" required>
    <textarea name="message" placeholder="Your Message" required></textarea>
    <button type="submit">Send Message</button>
</form>
```

### Option 2: EmailJS

1. Sign up at https://www.emailjs.com/
2. Add before closing `</body>`:

```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script>
    emailjs.init('YOUR_PUBLIC_KEY');
</script>
```

3. Update form handler in `js/main.js`

## Mobile Responsiveness Testing

Test on different screen sizes:
- Desktop: 1920px
- Laptop: 1366px
- Tablet: 768px
- Mobile: 375px

## Performance Tips

1. **Optimize Images**: Use compressed images (TinyPNG, ImageOptim)
2. **Lazy Loading**: Add `loading="lazy"` to images
3. **Minify CSS/JS**: Before production deployment
4. **CDN**: Use for libraries (Bootstrap, Font Awesome)

## SEO Optimization

Update meta tags in `<head>`:
```html
<meta name="description" content="Your custom description">
<meta name="keywords" content="salesforce, developer, your, keywords">
<meta name="author" content="Your Name">

<!-- Open Graph for social sharing -->
<meta property="og:title" content="Your Name - Salesforce Developer">
<meta property="og:description" content="Your description">
<meta property="og:image" content="https://yoursite.com/preview-image.jpg">
<meta property="og:url" content="https://yoursite.com">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Your Name - Salesforce Developer">
<meta name="twitter:description" content="Your description">
```

## Debugging

Check browser console (F12) for:
- JavaScript errors
- Failed API calls
- CSS issues

Test locally before deploying:
```bash
npm start
# Visit http://localhost:3000
```

## Need Help?

- Check browser console for errors
- Review README.md for setup instructions
- Check DEPLOYMENT.md for Heroku issues
- Test in incognito mode to avoid cache issues

---

**Remember:** After making changes, test locally, commit to Git, and push to Heroku!

