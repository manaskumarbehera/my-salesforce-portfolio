# Environment Variables Configuration Guide

This guide explains how to configure your portfolio using Heroku environment variables instead of hardcoding values.

## Portfolio Configuration Variables

### Projects Configuration

Configure your projects via the `PORTFOLIO_PROJECTS` environment variable:

```bash
# Example: Set projects via Heroku CLI
heroku config:set PORTFOLIO_PROJECTS='[
  {
    "key": "portfolio",
    "name": "My Portfolio",
    "description": "Professional developer portfolio website.",
    "icon": "fas fa-briefcase",
    "tags": ["Portfolio", "Bootstrap", "Node.js"],
    "github": "https://github.com/username/my-portfolio",
    "live": "https://www.example.com/",
    "featured": true
  },
  {
    "key": "my-chrome-ext",
    "name": "My Chrome Extension",
    "description": "A useful Chrome extension.",
    "icon": "fab fa-chrome",
    "tags": ["Chrome Extension", "JavaScript"],
    "github": "https://github.com/username/chrome-ext",
    "chromeStore": "https://chromewebstore.google.com/detail/ext-name/extension-id",
    "extensionId": "your-extension-id-here",
    "featured": true
  }
]'
```

### Chrome Extensions Configuration

Configure your Chrome extensions for real-time user count fetching:

```bash
# Example: Set Chrome extensions via Heroku CLI
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
  }
]'
```

### Extension User Counts (Manual Override)

If Chrome Web Store scraping doesn't work reliably, you can manually set user counts:

```bash
# Manual user counts (optional - for when scraping fails)
heroku config:set EXTENSION_USER_COUNTS='{"trackforcepro":150,"weeknumber":350,"metaforce":60}'
```

### GitHub Username

Set your GitHub username for repository features:

```bash
heroku config:set GITHUB_USERNAME='manaskumarbehera'
```

## Project Object Schema

Each project in `PORTFOLIO_PROJECTS` should follow this schema:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `key` | string | Yes | Unique identifier for the project |
| `name` | string | Yes | Display name of the project |
| `description` | string | Yes | Project description |
| `icon` | string | No | Font Awesome icon class (e.g., `fab fa-chrome`) |
| `tags` | array | No | Array of tag strings |
| `github` | string | No | GitHub repository URL |
| `live` | string | No | Live website URL |
| `chromeStore` | string | No | Chrome Web Store URL |
| `extensionId` | string | No | Chrome extension ID (for user count fetching) |
| `featured` | boolean | No | Whether to show on homepage (default: true) |

## Chrome Extension Object Schema

Each extension in `CHROME_EXTENSIONS` should follow this schema:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `key` | string | Yes | Unique identifier matching project key |
| `id` | string | Yes | Chrome extension ID (32 chars) |
| `name` | string | Yes | Display name |
| `storeUrl` | string | Yes | Chrome Web Store URL |
| `icon` | string | No | Font Awesome icon class |

## How Chrome Extension User Counts Work

The server fetches user counts from Chrome Web Store in the following priority:

1. **Manual Override**: If `EXTENSION_USER_COUNTS` is set, those values are used
2. **Chrome Web Store Scraping**: The server attempts to scrape user counts from the Chrome Web Store
3. **Fallback**: If all methods fail, "N/A" is displayed

User counts are cached for 1 hour to avoid rate limiting.

## API Endpoints

### Get Portfolio Configuration
```
GET /api/portfolio/config
```

Returns:
```json
{
  "success": true,
  "source": "env",
  "data": {
    "projects": [...],
    "chromeExtensions": [...],
    "totalProjects": 5,
    "totalExtensions": 3
  }
}
```

### Get Extension Stats
```
GET /api/extensions/stats
```

Returns real-time user counts for all configured Chrome extensions:
```json
{
  "success": true,
  "cached": false,
  "data": {
    "extensions": {
      "trackforcepro": {
        "name": "TrackForce Pro",
        "id": "eombeiphccjbnndbabnkimdlkpaooipk",
        "users": 150,
        "usersFormatted": "150"
      }
    },
    "totalUsers": 560,
    "totalUsersFormatted": "560",
    "fetchedAt": "2026-03-14T10:00:00.000Z"
  }
}
```

### Get Single Extension Stats
```
GET /api/extensions/:extensionKey/stats
```

## Setting Variables via Heroku Dashboard

1. Go to your Heroku app dashboard
2. Click **Settings** tab
3. Click **Reveal Config Vars**
4. Add each variable:
   - **Key**: `PORTFOLIO_PROJECTS`
   - **Value**: Your JSON array (minified)

## Quick Setup Commands

```bash
# Set all portfolio config at once
heroku config:set \
  GITHUB_USERNAME='your-username' \
  PORTFOLIO_PROJECTS='[{"key":"project1","name":"Project 1","description":"Description","github":"https://github.com/you/repo","featured":true}]' \
  CHROME_EXTENSIONS='[{"key":"ext1","id":"extension-id","name":"Extension Name","storeUrl":"https://chromewebstore.google.com/detail/ext/id"}]'

# Verify your config
heroku config

# Restart to apply changes
heroku restart
```

## Fallback Behavior

If environment variables are not set, the application falls back to reading from `portfolio-config.json` in the project root. This allows local development without setting environment variables.

## Troubleshooting

### Projects not showing
- Check that `PORTFOLIO_PROJECTS` is valid JSON
- Ensure all projects have `featured: true` (or omit the field)
- Check browser console for errors

### Extension user counts showing N/A
- Set `EXTENSION_USER_COUNTS` manually as a fallback
- Verify extension IDs are correct (32-character alphanumeric)
- Check server logs for scraping errors

### Config not updating
- Run `heroku restart` after changing config vars
- Clear browser cache
- Wait for the 1-hour cache to expire (or restart server)

