# Email DNS Setup Guide

This guide helps you configure email sending from your custom domain `web@manaskumarbehera.com` on your Heroku portfolio app.

## 📧 Understanding Email Modes

### Mode A: Real Mailbox SMTP (Recommended)
- **Requires**: Paid email service (Google Workspace, Microsoft 365, Zoho)
- **Sends As**: `web@manaskumarbehera.com`
- **Full control**: SPF, DKIM, DMARC authentication
- **Best deliverability**: Emails won't go to spam

### Mode B: Forward-Only Fallback (Current Setup)
- **Uses**: Your personal Outlook account
- **Sends As**: Your personal email (manaskumarbehera1@outlook.com)
- **Reply-To**: `web@manaskumarbehera.com`
- **Limitation**: Cannot truly send "from" your domain

---

## 🎯 Quick Setup: Outlook (CURRENT PRODUCTION CONFIG)

Your portfolio is configured to use Outlook for sending emails:

### Current Heroku Config Vars
```bash
heroku config:set EMAIL_MODE=smtp -a manaskumarbehera
heroku config:set EMAIL_HOST=smtp.office365.com -a manaskumarbehera
heroku config:set EMAIL_PORT=587 -a manaskumarbehera
heroku config:set EMAIL_USER=manaskumarbehera1@outlook.com -a manaskumarbehera
heroku config:set EMAIL_PASS=YOUR_OUTLOOK_APP_PASSWORD -a manaskumarbehera
heroku config:set EMAIL_TO=manaskumarbehera1@outlook.com -a manaskumarbehera
heroku config:set EMAIL_FROM=web@manaskumarbehera.com -a manaskumarbehera
heroku config:set EMAIL_REPLY_TO_DOMAIN=web@manaskumarbehera.com -a manaskumarbehera
```

### ⚠️ IMPORTANT: Get Outlook App Password

**You MUST use an App Password, NOT your regular Outlook password!**

1. Go to [Microsoft Account Security](https://account.microsoft.com/security)
2. Click **Advanced security options**
3. Enable **Two-step verification** (if not already enabled)
4. After enabling, scroll down to **App passwords**
5. Click **Create a new app password**
6. Name it "HerokuPortfolio" or similar
7. Copy the generated password (it looks like: `abcd-efgh-ijkl-mnop`)
8. Use that password in Heroku:

```bash
heroku config:set EMAIL_PASS=abcd-efgh-ijkl-mnop -a manaskumarbehera
heroku restart -a manaskumarbehera
```

### 🧠 Why App Passwords?

Modern email security doesn't allow raw passwords for third-party apps:
- **Regular password** = Your login password (blocked for SMTP)
- **App password** = A disposable, revocable token for apps

Gmail requires App Passwords. Outlook requires App Passwords. This is security 101.

---

## 🔄 Alternative: Use Gmail Instead

If you prefer Gmail:

### Gmail Heroku Config
```bash
heroku config:set EMAIL_HOST=smtp.gmail.com -a manaskumarbehera
heroku config:set EMAIL_USER=your-gmail@gmail.com -a manaskumarbehera
heroku config:set EMAIL_PASS=xxxx-xxxx-xxxx-xxxx -a manaskumarbehera
```

### Gmail App Password
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Go to **App passwords**
4. Select App: Mail, Device: Other (name it "HerokuPortfolio")
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
heroku config:set EMAIL_HOST=smtp.office365.com -a manaskumarbehera
heroku config:set EMAIL_PORT=587 -a manaskumarbehera
heroku config:set EMAIL_USER=web@manaskumarbehera.com -a manaskumarbehera
heroku config:set EMAIL_PASS=your-app-password -a manaskumarbehera
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

### ⚠️ Most Common Issue: Wrong Password Type

**NEVER use your regular email password!**

| Provider | App Password Required? | How to Get |
|----------|----------------------|------------|
| **Outlook** | ✅ YES | account.microsoft.com/security → App passwords |
| **Gmail** | ✅ YES | myaccount.google.com/security → App passwords |
| **Zoho** | ✅ YES | accounts.zoho.com → Security → App passwords |

### Gmail "Less secure app" Error
- Gmail requires App Passwords for third-party apps
- Enable 2FA, then create an App Password
- Go to: myaccount.google.com/apppasswords

### Outlook "535 Authentication Failed"
- You're using your regular password instead of App Password
- Go to: account.microsoft.com/security
- Enable Two-step verification FIRST
- Then create App Password
- Use the generated password in EMAIL_PASS

### "535 Authentication Failed" (General)
- Wrong password or app password
- Account may have blocked sign-in (check security alerts)
- For Outlook: Must enable Two-step verification before App Passwords work

### Gmail vs Outlook SMTP Host Mismatch
- If `EMAIL_HOST=smtp.gmail.com` → Use Gmail App Password
- If `EMAIL_HOST=smtp.office365.com` → Use Outlook App Password
- **DO NOT MIX THEM!**

### Port 465 vs 587
- **Port 587**: TLS/STARTTLS (recommended)
- **Port 465**: SSL (legacy, but still works)
- Outlook uses 587, Gmail supports both

### "553 Invalid Sender"
- You're trying to send "from" an email you don't control
- In `forward_only` mode, use your actual email as sender
- EMAIL_FROM must match a verified email on your SMTP account

### Emails Going to Spam
1. Check SPF record is correct
2. Add DKIM (provider-specific)
3. Add DMARC record
4. Don't use spam trigger words
5. Include plain text version (already implemented)

### "ECONNREFUSED"
- Check EMAIL_HOST is correct
- Outlook: Use `smtp.office365.com` (NOT `smtp-mail.outlook.com`)
- Check firewall isn't blocking outbound SMTP
- Try port 465 instead of 587 (or vice versa)

### "ETIMEDOUT"
- Network issue or wrong host
- Heroku may have outbound SMTP blocked on some plans
- Try the email health endpoint: `/api/email/health?verify=true`

---

## 📊 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `EMAIL_MODE` | Yes | `smtp` | `smtp` or `forward_only` |
| `EMAIL_HOST` | Yes | - | SMTP server (`smtp.office365.com` for Outlook) |
| `EMAIL_PORT` | Yes | `587` | SMTP port |
| `EMAIL_USER` | Yes | - | Your email address |
| `EMAIL_PASS` | Yes | - | **App Password** (NOT regular password!) |
| `EMAIL_TO` | Yes | - | Notification recipient |
| `EMAIL_FROM` | No | Auto | From address |
| `EMAIL_FROM_NAME` | No | `Manas` | Display name |
| `EMAIL_SECURE` | No | Auto | Force SSL (auto by port) |
| `EMAIL_REPLY_TO_DOMAIN` | No | `web@manaskumarbehera.com` | Reply-To header |

---

## 🎯 Current Recommended Setup

You are using **Outlook (smtp.office365.com)**:

```bash
EMAIL_MODE=smtp
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_USER=manaskumarbehera1@outlook.com
EMAIL_PASS=<YOUR_OUTLOOK_APP_PASSWORD>
EMAIL_TO=manaskumarbehera1@outlook.com
EMAIL_FROM=web@manaskumarbehera.com
```

For custom domain email, consider **Google Workspace** or **Zoho Mail**.

---

## 📞 Need Help?

1. Check the [Troubleshooting](#-troubleshooting) section
2. View Heroku logs: `heroku logs --tail -a manaskumarbehera`
3. Test email health: `curl https://www.manaskumarbehera.com/api/email/health?verify=true`

