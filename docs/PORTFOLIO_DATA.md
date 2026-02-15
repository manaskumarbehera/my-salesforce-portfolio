# Portfolio Data Configuration Guide

This document explains how to configure projects and Chrome extension user data for the portfolio website.

## Overview

The portfolio supports loading projects and Chrome extension data from:
1. **Environment Variables** (recommended for Heroku deployment)
2. **JSON Configuration File** (fallback for local development)

## Configuration Methods

### Method 1: Environment Variables (Recommended for Production)

Set the following environment variables in Heroku or your hosting platform:

#### `PORTFOLIO_PROJECTS`
JSON string containing all projects to display on the portfolio.

```bash
# Heroku CLI example
heroku config:set PORTFOLIO_PROJECTS='[
  {
    "key": "portfolio",
    "name": "My Portfolio",
    "description": "Professional Salesforce Developer portfolio website showcasing projects, skills, and Chrome extensions. Built with Bootstrap & Node.js.",
    "icon": "fas fa-briefcase",
    "tags": ["Portfolio", "Bootstrap", "Node.js"],
    "github": "https://github.com/manaskumarbehera/my-salesforce-portfolio",
    "live": "https://www.manaskumarbehera.com/",
    "featured": true
  },
  {
    "key": "trackforcepro",
    "name": "TrackForce Pro",
    "description": "Chrome extension to extract and analyze Salesforce audit trail data with comprehensive reporting and insights for compliance monitoring.",
    "icon": "fab fa-chrome",
    "tags": ["Chrome Extension", "Salesforce", "Audit Logs"],
    "github": "https://github.com/manaskumarbehera/sf-audit-extractor",
    "chromeStore": "https://chromewebstore.google.com/detail/trackforcepro/eombeiphccjbnndbabnkimdlkpaooipk",
    "featured": true,
    "extensionId": "eombeiphccjbnndbabnkimdlkpaooipk"
  }
]'
```

#### `CHROME_EXTENSIONS`
JSON string containing Chrome extension metadata for user count tracking.

```bash
# Heroku CLI example
heroku config:set CHROME_EXTENSIONS='[
  {
    "key": "trackforcepro",
    "id": "eombeiphccjbnndbabnkimdlkpaooipk",
    "name": "TrackForce Pro",
    "storeUrl": "https://chromewebstore.google.com/detail/trackforcepro/eombeiphccjbnndbabnkimdlkpaooipk",
    "icon": "fab fa-chrome"
  },
  {
    "key": "weeknumber",
    "id": "hjbeeopedbnpahgbkndkemigkcellibm",
    "name": "Week Number",
    "storeUrl": "https://chromewebstore.google.com/detail/week-number/hjbeeopedbnpahgbkndkemigkcellibm",
    "icon": "fab fa-chrome"
  },
  {
    "key": "metaforce",
    "id": "hclbblgimnkmlmnkekmbclfemhdgmjep",
    "name": "MetaForce",
    "storeUrl": "https://chromewebstore.google.com/detail/metaforce/hclbblgimnkmlmnkekmbclfemhdgmjep",
    "icon": "fab fa-chrome"
  }
]'
```

### Method 2: JSON Configuration File (Local Development)

Create or edit `portfolio-config.json` in the project root:

```json
{
  "projects": [
    {
      "key": "portfolio",
      "name": "My Portfolio",
      "description": "Professional Salesforce Developer portfolio website...",
      "icon": "fas fa-briefcase",
      "tags": ["Portfolio", "Bootstrap", "Node.js"],
      "github": "https://github.com/manaskumarbehera/my-salesforce-portfolio",
      "live": "https://www.manaskumarbehera.com/",
      "featured": true
    }
  ],
  "chromeExtensions": [
    {
      "key": "trackforcepro",
      "id": "eombeiphccjbnndbabnkimdlkpaooipk",
      "name": "TrackForce Pro",
      "storeUrl": "https://chromewebstore.google.com/detail/trackforcepro/eombeiphccjbnndbabnkimdlkpaooipk",
      "icon": "fab fa-chrome"
    }
  ]
}
```

---

## Data Schema

### Project Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `key` | string | ✅ | Unique identifier for the project |
| `name` | string | ✅ | Display name of the project |
| `description` | string | ✅ | Brief description (1-2 sentences) |
| `icon` | string | ✅ | FontAwesome icon class (e.g., `fab fa-chrome`) |
| `tags` | array | ✅ | Array of tag strings for badges |
| `github` | string | ❌ | GitHub repository URL |
| `live` | string | ❌ | Live demo/website URL |
| `chromeStore` | string | ❌ | Chrome Web Store URL (for extensions) |
| `featured` | boolean | ❌ | Show on homepage (default: false) |
| `extensionId` | string | ❌ | Chrome extension ID (for user tracking) |

### Chrome Extension Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `key` | string | ✅ | Unique identifier (lowercase, no spaces) |
| `id` | string | ✅ | Chrome Web Store extension ID |
| `name` | string | ✅ | Display name of the extension |
| `storeUrl` | string | ✅ | Full Chrome Web Store URL |
| `icon` | string | ❌ | FontAwesome icon class (default: `fab fa-chrome`) |

---

## API Endpoints

### `GET /api/portfolio/projects`
Returns all configured projects.

**Response:**
```json
{
  "success": true,
  "source": "env|file",
  "projects": [...]
}
```

### `GET /api/portfolio/config`
Returns full portfolio configuration including projects and extensions.

**Response:**
```json
{
  "success": true,
  "source": "env|file",
  "data": {
    "projects": [...],
    "chromeExtensions": [...]
  }
}
```

### `GET /api/extensions/stats`
Returns live user counts for all Chrome extensions (cached for 1 hour).

**Response:**
```json
{
  "success": true,
  "cached": true|false,
  "data": {
    "extensions": {
      "trackforcepro": {
        "name": "TrackForce Pro",
        "id": "eombeiphccjbnndbabnkimdlkpaooipk",
        "users": 150,
        "usersFormatted": "150"
      }
    },
    "totalUsers": 300,
    "totalUsersFormatted": "300",
    "fetchedAt": "2026-02-15T12:00:00.000Z"
  }
}
```

---

## Heroku Deployment Commands

### Set All Config at Once

```bash
# Set projects
heroku config:set PORTFOLIO_PROJECTS='[{"key":"portfolio","name":"My Portfolio","description":"Professional portfolio","icon":"fas fa-briefcase","tags":["Portfolio","Bootstrap"],"github":"https://github.com/manaskumarbehera/my-salesforce-portfolio","live":"https://www.manaskumarbehera.com/","featured":true},{"key":"trackforcepro","name":"TrackForce Pro","description":"Salesforce audit trail Chrome extension","icon":"fab fa-chrome","tags":["Chrome Extension","Salesforce"],"github":"https://github.com/manaskumarbehera/sf-audit-extractor","chromeStore":"https://chromewebstore.google.com/detail/trackforcepro/eombeiphccjbnndbabnkimdlkpaooipk","featured":true,"extensionId":"eombeiphccjbnndbabnkimdlkpaooipk"}]' --app manaskumarbehera

# Set Chrome extensions
heroku config:set CHROME_EXTENSIONS='[{"key":"trackforcepro","id":"eombeiphccjbnndbabnkimdlkpaooipk","name":"TrackForce Pro","storeUrl":"https://chromewebstore.google.com/detail/trackforcepro/eombeiphccjbnndbabnkimdlkpaooipk"},{"key":"weeknumber","id":"hjbeeopedbnpahgbkndkemigkcellibm","name":"Week Number","storeUrl":"https://chromewebstore.google.com/detail/week-number/hjbeeopedbnpahgbkndkemigkcellibm"},{"key":"metaforce","id":"hclbblgimnkmlmnkekmbclfemhdgmjep","name":"MetaForce","storeUrl":"https://chromewebstore.google.com/detail/metaforce/hclbblgimnkmlmnkekmbclfemhdgmjep"}]' --app manaskumarbehera
```

### View Current Config

```bash
heroku config --app manaskumarbehera
```

### Remove Config

```bash
heroku config:unset PORTFOLIO_PROJECTS --app manaskumarbehera
```

---

## Adding a New Project

### Step 1: Prepare Project Data

```json
{
  "key": "my-new-project",
  "name": "My New Project",
  "description": "Description of the new project",
  "icon": "fas fa-rocket",
  "tags": ["Tag1", "Tag2"],
  "github": "https://github.com/username/repo",
  "live": "https://example.com",
  "featured": true
}
```

### Step 2: Update Environment Variable

Get current projects:
```bash
heroku config:get PORTFOLIO_PROJECTS --app manaskumarbehera
```

Add new project to the JSON array and update:
```bash
heroku config:set PORTFOLIO_PROJECTS='[...existing..., {...new project...}]' --app manaskumarbehera
```

### Step 3: Restart Dyno (Optional)
```bash
heroku restart --app manaskumarbehera
```

---

## Adding a New Chrome Extension

### Step 1: Get Extension ID

1. Go to Chrome Web Store
2. Navigate to your extension page
3. Copy the ID from the URL: `chrome.google.com/webstore/detail/extension-name/EXTENSION_ID_HERE`

### Step 2: Prepare Extension Data

```json
{
  "key": "my-extension",
  "id": "abcdefghijklmnopqrstuvwxyz123456",
  "name": "My Extension",
  "storeUrl": "https://chromewebstore.google.com/detail/my-extension/abcdefghijklmnopqrstuvwxyz123456"
}
```

### Step 3: Update Environment Variable

```bash
heroku config:set CHROME_EXTENSIONS='[...existing..., {...new extension...}]' --app manaskumarbehera
```

---

## Troubleshooting

### JSON Parse Errors

If you see "Failed to parse PORTFOLIO_PROJECTS from environment variable", check:
1. Valid JSON syntax (use https://jsonlint.com/)
2. No unescaped quotes in descriptions
3. Single quotes wrapping the entire value in shell commands

### Extension User Count Not Loading

1. Check if extension ID is correct
2. Chrome Web Store may rate-limit requests
3. Check server logs: `heroku logs --tail --app manaskumarbehera`

### Projects Not Displaying

1. Verify API response: `curl https://your-app.herokuapp.com/api/portfolio/projects`
2. Check browser console for JavaScript errors
3. Ensure `featured: true` is set for homepage display

---

## Example Full Configuration

```json
{
  "projects": [
    {
      "key": "portfolio",
      "name": "My Portfolio",
      "description": "Professional Salesforce Developer portfolio website showcasing projects, skills, and Chrome extensions. Built with Bootstrap & Node.js.",
      "icon": "fas fa-briefcase",
      "tags": ["Portfolio", "Bootstrap", "Node.js"],
      "github": "https://github.com/manaskumarbehera/my-salesforce-portfolio",
      "live": "https://www.manaskumarbehera.com/",
      "featured": true
    },
    {
      "key": "trackforcepro",
      "name": "TrackForce Pro",
      "description": "Chrome extension to extract and analyze Salesforce audit trail data with comprehensive reporting and insights for compliance monitoring.",
      "icon": "fab fa-chrome",
      "tags": ["Chrome Extension", "Salesforce", "Audit Logs"],
      "github": "https://github.com/manaskumarbehera/sf-audit-extractor",
      "chromeStore": "https://chromewebstore.google.com/detail/trackforcepro/eombeiphccjbnndbabnkimdlkpaooipk",
      "featured": true,
      "extensionId": "eombeiphccjbnndbabnkimdlkpaooipk"
    },
    {
      "key": "weeknumber",
      "name": "Week Number",
      "description": "Chrome extension that displays current week number with customizable date formats and ISO week calculations from browser toolbar.",
      "icon": "fab fa-chrome",
      "tags": ["Chrome Extension", "JavaScript", "Productivity"],
      "github": "https://github.com/manaskumarbehera/CurrentWeek",
      "chromeStore": "https://chromewebstore.google.com/detail/week-number/hjbeeopedbnpahgbkndkemigkcellibm",
      "featured": true,
      "extensionId": "hjbeeopedbnpahgbkndkemigkcellibm"
    },
    {
      "key": "metaforce",
      "name": "MetaForce",
      "description": "Powerful Salesforce metadata browser extension for developers. View, search, and navigate org metadata directly from your browser.",
      "icon": "fab fa-chrome",
      "tags": ["Chrome Extension", "Salesforce", "Metadata"],
      "github": "https://github.com/manaskumarbehera/metaforce",
      "chromeStore": "https://chromewebstore.google.com/detail/metaforce/hclbblgimnkmlmnkekmbclfemhdgmjep",
      "featured": true,
      "extensionId": "hclbblgimnkmlmnkekmbclfemhdgmjep"
    }
  ],
  "chromeExtensions": [
    {
      "key": "trackforcepro",
      "id": "eombeiphccjbnndbabnkimdlkpaooipk",
      "name": "TrackForce Pro",
      "storeUrl": "https://chromewebstore.google.com/detail/trackforcepro/eombeiphccjbnndbabnkimdlkpaooipk",
      "icon": "fab fa-chrome"
    },
    {
      "key": "weeknumber",
      "id": "hjbeeopedbnpahgbkndkemigkcellibm",
      "name": "Week Number",
      "storeUrl": "https://chromewebstore.google.com/detail/week-number/hjbeeopedbnpahgbkndkemigkcellibm",
      "icon": "fab fa-chrome"
    },
    {
      "key": "metaforce",
      "id": "hclbblgimnkmlmnkekmbclfemhdgmjep",
      "name": "MetaForce",
      "storeUrl": "https://chromewebstore.google.com/detail/metaforce/hclbblgimnkmlmnkekmbclfemhdgmjep",
      "icon": "fab fa-chrome"
    }
  ]
}
```

---

## Related Documentation

- [CONFIGURATION_GUIDE.md](./CONFIGURATION_GUIDE.md) - General app configuration
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Heroku deployment guide
- [API.md](./API.md) - Full API documentation

