# 🔌 API Documentation

Complete API reference for the Salesforce Developer Portfolio.

**Base URL:** `https://www.manaskumarbehera.com` (production) or `http://localhost:3000` (development)

---

## 📧 Contact API

### POST /api/contact

Submit a contact form message. Sends email notification and auto-reply.

**Rate Limit:** 10 requests per 15 minutes per IP

**Request:**
```bash
curl -X POST https://www.manaskumarbehera.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Inquiry",
    "message": "I would like to discuss a Salesforce project."
  }'
```

**Required Fields:**
- `name` - Sender's name
- `email` - Sender's email (must be valid)
- `message` - Message content

**Optional Fields:**
- `subject` - Message subject (defaults to "Contact Form Submission")

**Response (Success):**
```json
{
  "ok": true,
  "success": true,
  "message": "Thank you for your message! I will get back to you soon."
}
```

**Response (Error - Validation):**
```json
{
  "ok": false,
  "success": false,
  "message": "Name, email, and message are required."
}
```

**Response (Error - Rate Limit):**
```json
{
  "success": false,
  "message": "Too many requests. Please try again later.",
  "retryAfter": "15 minutes"
}
```

---

## 📧 Email Health API

### GET /api/email/health

Check email configuration status.

**Request:**
```bash
curl https://www.manaskumarbehera.com/api/email/health
```

**Response (Configured):**
```json
{
  "ok": true,
  "configured": true,
  "mode": "smtp",
  "host": "smtp.gmail.com",
  "port": 587,
  "secure": false
}
```

**Response (Not Configured):**
```json
{
  "ok": false,
  "configured": false,
  "error": "Missing required email config: EMAIL_HOST, EMAIL_USER"
}
```

### GET /api/email/health?verify=true

Verify SMTP connection is working.

**Request:**
```bash
curl "https://www.manaskumarbehera.com/api/email/health?verify=true"
```

**Response (Success):**
```json
{
  "ok": true,
  "configured": true,
  "mode": "smtp",
  "host": "smtp.gmail.com",
  "verified": true
}
```

**Response (Failure):**
```json
{
  "ok": false,
  "configured": true,
  "mode": "smtp",
  "verified": false,
  "error": "Authentication failed. Check EMAIL_USER and EMAIL_PASS."
}
```

---

## 🤖 Chat API (AI Chatbot)

### POST /api/chat

Send a message to the AI chatbot assistant.

**Request:**
```bash
curl -X POST https://www.manaskumarbehera.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are your skills?"}'
```

**Response:**
```json
{
  "success": true,
  "response": "Manas is a skilled Salesforce Developer with expertise in: Apex, LWC, Visualforce, SOQL/SOSL, Triggers, Batch Apex, and more!",
  "source": "local"
}
```

**Source values:**
- `astratis-ai` - Response from Astratis AI
- `local` - Fallback keyword-based response

**Supported topics:**
- Skills/expertise
- Projects
- Tools/extensions
- Contact information
- Salesforce experience
- General help

---

## ⭐ Recommendations API

### GET /api/recommendations

Get all approved recommendations.

**Request:**
```bash
curl https://www.manaskumarbehera.com/api/recommendations
```

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "id": "1707984000000",
      "name": "John Doe",
      "title": "Senior Developer at Company XYZ",
      "linkedin": "https://linkedin.com/in/johndoe",
      "relationship": "Colleague",
      "message": "Manas is an exceptional developer...",
      "rating": 5,
      "status": "approved",
      "timestamp": "2026-02-15T10:00:00.000Z",
      "approvedAt": "2026-02-15T12:00:00.000Z"
    }
  ]
}
```

### POST /api/recommendations

Submit a new recommendation (requires approval).

**Request:**
```bash
curl -X POST https://www.manaskumarbehera.com/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "title": "Senior Developer at Company XYZ",
    "email": "john@example.com",
    "linkedin": "https://linkedin.com/in/johndoe",
    "relationship": "Colleague",
    "message": "Manas is an exceptional Salesforce developer with deep expertise in Apex and LWC. Highly recommended!",
    "rating": 5
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your recommendation! It will be reviewed and published soon."
}
```

**Validation:**
- All fields except `linkedin` are required
- `message` must be at least 50 characters
- `rating` must be 1-5

### GET /api/recommendations/all?key=ADMIN_KEY

Get all recommendations (including pending/rejected). Requires admin key.

**Request:**
```bash
curl "https://www.manaskumarbehera.com/api/recommendations/all?key=your-admin-key"
```

### GET /api/recommendations/approve?id=ID&key=ADMIN_KEY

Approve a pending recommendation.

**Request:**
```bash
curl "https://www.manaskumarbehera.com/api/recommendations/approve?id=1707984000000&key=your-admin-key"
```

### GET /api/recommendations/reject?id=ID&key=ADMIN_KEY

Reject a recommendation.

**Request:**
```bash
curl "https://www.manaskumarbehera.com/api/recommendations/reject?id=1707984000000&key=your-admin-key"
```

---

## 📦 Portfolio Configuration API

### GET /api/portfolio/projects

Get all configured projects. Projects can be configured via `PORTFOLIO_PROJECTS` environment variable or `portfolio-config.json` file.

**Request:**
```bash
curl https://www.manaskumarbehera.com/api/portfolio/projects
```

**Response:**
```json
{
  "success": true,
  "source": "env",
  "count": 4,
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
    },
    {
      "key": "trackforcepro",
      "name": "TrackForce Pro",
      "description": "Chrome extension to extract and analyze Salesforce audit trail...",
      "icon": "fab fa-chrome",
      "tags": ["Chrome Extension", "Salesforce"],
      "chromeStore": "https://chromewebstore.google.com/detail/...",
      "featured": true,
      "extensionId": "eombeiphccjbnndbabnkimdlkpaooipk"
    }
  ]
}
```

**Source values:**
- `env` - Loaded from environment variables
- `file` - Loaded from portfolio-config.json
- `default` - Using built-in defaults

### GET /api/portfolio/projects/featured

Get only featured projects (where `featured: true`).

**Request:**
```bash
curl https://www.manaskumarbehera.com/api/portfolio/projects/featured
```

**Response:**
```json
{
  "success": true,
  "source": "env",
  "count": 3,
  "projects": [...]
}
```

### GET /api/portfolio/config

Get full portfolio configuration including projects and Chrome extensions.

**Request:**
```bash
curl https://www.manaskumarbehera.com/api/portfolio/config
```

**Response:**
```json
{
  "success": true,
  "source": "env",
  "data": {
    "projects": [...],
    "chromeExtensions": [...],
    "totalProjects": 4,
    "totalExtensions": 3
  }
}
```

**Configuration via Environment Variables:**
```bash
# Set projects
heroku config:set PORTFOLIO_PROJECTS='[{"key":"myproject","name":"My Project",...}]'

# Set Chrome extensions  
heroku config:set CHROME_EXTENSIONS='[{"key":"myext","id":"extension-id",...}]'
```

**Full Configuration Guide:** [PORTFOLIO_DATA.md](PORTFOLIO_DATA.md)

---

## 📊 Chrome Extension Stats API

### GET /api/extensions/stats

Get user counts for all Chrome extensions. Results are cached for 1 hour.

**Request:**
```bash
curl https://www.manaskumarbehera.com/api/extensions/stats
```

**Response:**
```json
{
  "success": true,
  "cached": true,
  "data": {
    "extensions": {
      "trackforcepro": {
        "name": "TrackForce Pro",
        "id": "eombeiphccjbnndbabnkimdlkpaooipk",
        "storeUrl": "https://chromewebstore.google.com/detail/trackforcepro/eombeiphccjbnndbabnkimdlkpaooipk",
        "users": 9,
        "usersFormatted": "9"
      },
      "weeknumber": {
        "name": "Week Number",
        "id": "hjbeeopedbnpahgbkndkemigkcellibm",
        "storeUrl": "https://chromewebstore.google.com/detail/week-number/hjbeeopedbnpahgbkndkemigkcellibm",
        "users": 332,
        "usersFormatted": "332"
      },
      "metaforce": {
        "name": "MetaForce",
        "id": "hclbblgimnkmlmnkekmbclfemhdgmjep",
        "storeUrl": "https://chromewebstore.google.com/detail/metaforce/hclbblgimnkmlmnkekmbclfemhdgmjep",
        "users": 54,
        "usersFormatted": "54"
      }
    },
    "totalUsers": 395,
    "totalUsersFormatted": "395",
    "fetchedAt": "2026-02-15T06:15:03.789Z"
  }
}
```

**Cache behavior:**
- `cached: true` - Returned from cache
- `cached: false` - Freshly fetched from Chrome Web Store

### GET /api/extensions/:extensionKey/stats

Get stats for a single extension.

**Valid extension keys:** `trackforcepro`, `weeknumber`, `metaforce`

**Request:**
```bash
curl https://www.manaskumarbehera.com/api/extensions/trackforcepro/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "TrackForce Pro",
    "id": "eombeiphccjbnndbabnkimdlkpaooipk",
    "storeUrl": "https://chromewebstore.google.com/detail/trackforcepro/eombeiphccjbnndbabnkimdlkpaooipk",
    "users": 9,
    "usersFormatted": "9",
    "fetchedAt": "2026-02-15T06:15:03.789Z"
  }
}
```

---

## 🔐 Environment Variables

Required configuration (set in Heroku Config Vars):

| Variable | Description | Required |
|----------|-------------|----------|
| `EMAIL_USER` | SMTP email address | Yes (for contact form) |
| `EMAIL_PASS` | SMTP password/app password | Yes (for contact form) |
| `EMAIL_HOST` | SMTP host (default: smtp-mail.outlook.com) | No |
| `EMAIL_PORT` | SMTP port (default: 587) | No |
| `ADMIN_KEY` | Admin key for recommendations | No (default: manas2026) |
| `ASTRATIS_URL` | Astratis AI API key | No (optional) |

**Set variables:**
```bash
heroku config:set EMAIL_USER=your-email@outlook.com -a manaskumarbehera
heroku config:set EMAIL_PASS=your-app-password -a manaskumarbehera
heroku config:set ADMIN_KEY=your-secret-key -a manaskumarbehera
```

---

## 🚦 Error Handling

All API endpoints return consistent error responses:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Description of validation error"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to process request"
}
```

---

## 🧪 Testing APIs Locally

Start the server and test:

```bash
# Start server
npm start

# Test contact (in new terminal)
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","subject":"Test","message":"Hello"}'

# Test chat
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"skills"}'

# Test recommendations
curl http://localhost:3000/api/recommendations

# Test extension stats
curl http://localhost:3000/api/extensions/stats
```

---

*Last updated: February 15, 2026*

