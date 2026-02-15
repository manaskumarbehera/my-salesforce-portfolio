# Email DNS Setup Guide

This guide helps you configure email sending from your custom domain `web@manaskumarbehera.com` on your Heroku portfolio app.

## 📧 Understanding Email Modes

### Mode A: Real Mailbox SMTP (Recommended)
- **Requires**: Paid email service (Google Workspace, Microsoft 365, Zoho)
- **Sends As**: `web@manaskumarbehera.com`
- **Full control**: SPF, DKIM, DMARC authentication
- **Best deliverability**: Emails won't go to spam

### Mode B: Forward-Only Fallback
- **Uses**: Your personal Gmail/Outlook account
- **Sends As**: Your personal email
- **Reply-To**: `web@manaskumarbehera.com`
- **Limitation**: Cannot truly send "from" your domain

---

## 🎯 Quick Setup: Mode B (Forward-Only)

If you want to keep Squarespace email forwarding and use your personal email for sending:

### Heroku Config Vars
```bash
heroku config:set EMAIL_MODE=forward_only -a manaskumarbehera
heroku config:set EMAIL_HOST=smtp.gmail.com -a manaskumarbehera
heroku config:set EMAIL_PORT=587 -a manaskumarbehera
heroku config:set EMAIL_USER=your-gmail@gmail.com -a manaskumarbehera
heroku config:set EMAIL_PASS=xxxx-xxxx-xxxx-xxxx -a manaskumarbehera
heroku config:set EMAIL_TO=manaskumarbehera1@outlook.com -a manaskumarbehera
heroku config:set EMAIL_REPLY_TO_DOMAIN=web@manaskumarbehera.com -a manaskumarbehera
```

### Gmail App Password
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Go to **App passwords**
4. Generate new app password for "Mail"
5. Use the 16-character code as `EMAIL_PASS`

---

## 🏆 Full Setup: Mode A (Real Mailbox SMTP)

### Step 1: Choose an Email Provider

| Provider | Cost | Setup Complexity | Notes |
|----------|------|------------------|-------|
| **Google Workspace** | $6/user/mo | Easy | Best for Gmail users |
| **Microsoft 365** | $6/user/mo | Easy | Best for Outlook users |
| **Zoho Mail** | Free tier available | Moderate | Good free option |
| **Mailgun/SendGrid** | Usage-based | Moderate | For transactional email |

### Step 2: Provider-Specific Setup

#### Option A: Google Workspace

1. **Sign up**: [workspace.google.com](https://workspace.google.com)
2. **Add domain**: `manaskumarbehera.com`
3. **Create email**: `web@manaskumarbehera.com`

**Squarespace DNS Records**:

| Type | Host/Name | Value | TTL |
|------|-----------|-------|-----|
| MX | @ | ASPMX.L.GOOGLE.COM | 3600 |
| MX | @ | ALT1.ASPMX.L.GOOGLE.COM | 3600 |
| MX | @ | ALT2.ASPMX.L.GOOGLE.COM | 3600 |
| MX | @ | ALT3.ASPMX.L.GOOGLE.COM | 3600 |
| MX | @ | ALT4.ASPMX.L.GOOGLE.COM | 3600 |
| TXT | @ | v=spf1 include:_spf.google.com ~all | 3600 |
| TXT | google._domainkey | (DKIM value from Google Admin) | 3600 |

**Heroku Config**:
```bash
heroku config:set EMAIL_MODE=smtp -a manaskumarbehera
heroku config:set EMAIL_HOST=smtp.gmail.com -a manaskumarbehera
heroku config:set EMAIL_PORT=587 -a manaskumarbehera
heroku config:set EMAIL_USER=web@manaskumarbehera.com -a manaskumarbehera
heroku config:set EMAIL_PASS=xxxx-xxxx-xxxx-xxxx -a manaskumarbehera
heroku config:set EMAIL_TO=manaskumarbehera1@outlook.com -a manaskumarbehera
heroku config:set EMAIL_FROM=web@manaskumarbehera.com -a manaskumarbehera
```

#### Option B: Microsoft 365

1. **Sign up**: [microsoft.com/microsoft-365](https://www.microsoft.com/microsoft-365)
2. **Add domain**: `manaskumarbehera.com`
3. **Create email**: `web@manaskumarbehera.com`

**Squarespace DNS Records**:

| Type | Host/Name | Value | TTL |
|------|-----------|-------|-----|
| MX | @ | manaskumarbehera-com.mail.protection.outlook.com | 3600 |
| TXT | @ | v=spf1 include:spf.protection.outlook.com ~all | 3600 |
| CNAME | selector1._domainkey | (from Microsoft 365 Admin) | 3600 |
| CNAME | selector2._domainkey | (from Microsoft 365 Admin) | 3600 |

**Heroku Config**:
```bash
heroku config:set EMAIL_MODE=smtp -a manaskumarbehera
heroku config:set EMAIL_HOST=smtp-mail.outlook.com -a manaskumarbehera
heroku config:set EMAIL_PORT=587 -a manaskumarbehera
heroku config:set EMAIL_USER=web@manaskumarbehera.com -a manaskumarbehera
heroku config:set EMAIL_PASS=your-password -a manaskumarbehera
heroku config:set EMAIL_TO=manaskumarbehera1@outlook.com -a manaskumarbehera
heroku config:set EMAIL_FROM=web@manaskumarbehera.com -a manaskumarbehera
```

#### Option C: Zoho Mail (Free Option)

1. **Sign up**: [zoho.com/mail](https://www.zoho.com/mail/)
2. **Add domain**: `manaskumarbehera.com`
3. **Create email**: `web@manaskumarbehera.com`

**Squarespace DNS Records**:

| Type | Host/Name | Value | TTL |
|------|-----------|-------|-----|
| MX | @ | mx.zoho.com (priority 10) | 3600 |
| MX | @ | mx2.zoho.com (priority 20) | 3600 |
| MX | @ | mx3.zoho.com (priority 50) | 3600 |
| TXT | @ | v=spf1 include:zoho.com ~all | 3600 |
| TXT | zmail._domainkey | (DKIM from Zoho) | 3600 |

**Heroku Config**:
```bash
heroku config:set EMAIL_MODE=smtp -a manaskumarbehera
heroku config:set EMAIL_HOST=smtp.zoho.com -a manaskumarbehera
heroku config:set EMAIL_PORT=587 -a manaskumarbehera
heroku config:set EMAIL_USER=web@manaskumarbehera.com -a manaskumarbehera
heroku config:set EMAIL_PASS=your-zoho-password -a manaskumarbehera
heroku config:set EMAIL_TO=manaskumarbehera1@outlook.com -a manaskumarbehera
heroku config:set EMAIL_FROM=web@manaskumarbehera.com -a manaskumarbehera
```

### Step 3: Add DMARC Record (All Providers)

Add this TXT record in Squarespace DNS:

| Type | Host/Name | Value | TTL |
|------|-----------|-------|-----|
| TXT | _dmarc | v=DMARC1; p=none; rua=mailto:web@manaskumarbehera.com; adkim=s; aspf=s; pct=100 | 3600 |

**DMARC Policy Explanation**:
- `p=none` - Monitor only (good for initial setup)
- Later change to `p=quarantine` or `p=reject` after verifying everything works

### Step 4: Disable Squarespace Email Forwarding

⚠️ **Important**: If you're using Mode A, you should disable Squarespace email forwarding:

1. Log in to Squarespace
2. Go to **Settings** → **Domains** → **manaskumarbehera.com**
3. Click **Email** tab
4. Remove or disable any email forwarding rules
5. Remove Squarespace's MX records if present

---

## ✅ Verification Checklist

### Test Email Health
```bash
curl https://www.manaskumarbehera.com/api/email/health
curl "https://www.manaskumarbehera.com/api/email/health?verify=true"
```

### Test Contact Form
```bash
curl -X POST https://www.manaskumarbehera.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"Test message"}'
```

### Check Email Headers
1. Send a test email
2. In recipient's inbox, view "Show Original" or "View Headers"
3. Look for:
   - `SPF: PASS`
   - `DKIM: PASS`
   - `DMARC: PASS`

### Verify DNS Records
Use these tools:
- [MXToolbox](https://mxtoolbox.com/SuperTool.aspx?action=spf%3amanaskumarbehera.com)
- [Google Admin Toolbox](https://toolbox.googleapps.com/apps/checkmx/)
- [Mail-Tester](https://www.mail-tester.com/) - Send test email for spam score

---

## 🔧 Troubleshooting

### Gmail "Less secure app" Error
- Gmail requires App Passwords for third-party apps
- Enable 2FA, then create an App Password

### "535 Authentication Failed"
- Wrong password or app password
- Account may have blocked sign-in (check Gmail security alerts)
- For Outlook: enable "Let apps use my account"

### Port 465 vs 587
- **Port 587**: TLS/STARTTLS (recommended)
- **Port 465**: SSL (legacy, but still works)
- Some providers only support one

### "553 Invalid Sender"
- You're trying to send "from" an email you don't control
- In `forward_only` mode, use your actual email as sender

### Emails Going to Spam
1. Check SPF record is correct
2. Add DKIM (provider-specific)
3. Add DMARC record
4. Don't use spam trigger words
5. Include plain text version (already implemented)

### "ECONNREFUSED"
- Check EMAIL_HOST is correct
- Check firewall isn't blocking outbound SMTP
- Try port 465 instead of 587 (or vice versa)

---

## 📊 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `EMAIL_MODE` | Yes | `smtp` | `smtp` or `forward_only` |
| `EMAIL_HOST` | Yes | - | SMTP server hostname |
| `EMAIL_PORT` | Yes | `587` | SMTP port |
| `EMAIL_USER` | Yes | - | SMTP username/email |
| `EMAIL_PASS` | Yes | - | SMTP password |
| `EMAIL_TO` | Yes | - | Notification recipient |
| `EMAIL_FROM` | No | Auto | From address |
| `EMAIL_FROM_NAME` | No | `Manas` | Display name |
| `EMAIL_SECURE` | No | Auto | Force SSL (auto by port) |
| `EMAIL_REPLY_TO_DOMAIN` | No | `web@manaskumarbehera.com` | Reply-To header |

---

## 🎯 Recommended Setup

For the best experience, we recommend **Google Workspace** or **Zoho Mail**:

1. **Cost**: Zoho has a free tier, Google Workspace starts at $6/month
2. **Reliability**: Both have excellent deliverability
3. **Features**: Calendar, Drive, etc. included
4. **SPF/DKIM/DMARC**: Easy to set up

If you want zero cost, use **Mode B (Forward-Only)** with Gmail App Password.

---

## 📞 Need Help?

1. Check the [Troubleshooting](#-troubleshooting) section
2. View Heroku logs: `heroku logs --tail -a manaskumarbehera`
3. Test email health: `curl https://www.manaskumarbehera.com/api/email/health?verify=true`

