# Domain Configuration - manaskumarbehera.com

> **Last Updated:** February 14, 2026

---

## 📋 Domain Overview

| Property | Value |
|----------|-------|
| **Domain Name** | `manaskumarbehera.com` |
| **Registrar** | Squarespace Domains |
| **DNS Management** | https://account.squarespace.com/domains/managed/manaskumarbehera.com/dns/dns-settings |
| **Hosting** | Heroku |
| **Heroku App** | `manaskumarbehera` |
| **Region** | EU (Europe) 🇪🇺 |
| **SSL** | Automatic (Heroku ACM) |
| **Status** | Active ✅ |

---

## 🌐 URLs

| URL | Description |
|-----|-------------|
| https://manaskumarbehera.com | Primary domain (root) |
| https://www.manaskumarbehera.com | WWW subdomain |
| https://manaskumarbehera-0a839944011b.herokuapp.com | Heroku default URL |

---

## 🔧 DNS Configuration

### Heroku DNS Targets

| Domain | Record Type | DNS Target |
|--------|-------------|------------|
| `manaskumarbehera.com` | ALIAS/ANAME | `computational-badlands-vqbas54dog957lhao8pf7fc1.herokudns.com` |
| `www.manaskumarbehera.com` | CNAME | `theoretical-ridge-1uiuylak162l9k9363hgnqk3.herokudns.com` |

### Google Domains DNS Records

| Host | Type | TTL | Data |
|------|------|-----|------|
| `@` | A | 3600 | `75.2.60.5` |
| `@` | A | 3600 | `99.80.186.122` |
| `www` | CNAME | 3600 | `theoretical-ridge-1uiuylak162l9k9363hgnqk3.herokudns.com` |

---

## 📧 Email Configuration

### Email Forwarding (Google Domains)

| Alias | Forwards To |
|-------|-------------|
| `web@manaskumarbehera.com` | `behera.manas98@gmail.com` |

### Setup Location
https://domains.google.com/registrar/manaskumarbehera.com/email

---

## 🔐 SSL Certificate

| Property | Value |
|----------|-------|
| **Provider** | Heroku ACM (Automated Certificate Management) |
| **Type** | Let's Encrypt |
| **Cost** | FREE |
| **Auto-Renewal** | Yes |

### Check SSL Status
```bash
heroku certs:auto -a manaskumarbehera
```

---

## 🛠️ Management Commands

### View Domains
```bash
heroku domains -a manaskumarbehera
```

### Add New Domain
```bash
heroku domains:add subdomain.manaskumarbehera.com -a manaskumarbehera
```

### Remove Domain
```bash
heroku domains:remove subdomain.manaskumarbehera.com -a manaskumarbehera
```

### Check SSL Status
```bash
heroku certs:auto -a manaskumarbehera
```

### Enable SSL
```bash
heroku certs:auto:enable -a manaskumarbehera
```

---

## 🔗 Important Links

| Service | URL |
|---------|-----|
| **Google Domains Dashboard** | https://domains.google.com/registrar/manaskumarbehera.com |
| **Google Domains DNS** | https://domains.google.com/registrar/manaskumarbehera.com/dns |
| **Google Domains Email** | https://domains.google.com/registrar/manaskumarbehera.com/email |
| **Heroku Dashboard** | https://dashboard.heroku.com/apps/manaskumarbehera |
| **DNS Propagation Check** | https://www.whatsmydns.net/#A/manaskumarbehera.com |

---

## 💰 Costs

| Item | Cost | Frequency |
|------|------|-----------|
| Domain (manaskumarbehera.com) | ~$12 | Yearly |
| Heroku Eco Dynos | $5 | Monthly |
| SSL Certificate | FREE | - |
| Email Forwarding | FREE | - |

### Annual Cost Summary
- **Minimum:** ~$72/year (Domain + Heroku Eco)
- **Domain Only:** ~$12/year

---

## 📅 Important Dates

| Event | Date |
|-------|------|
| Domain Registered | February 2026 |
| Domain Expiry | February 2027 (renew annually) |
| SSL Auto-Renewal | Automatic |

---

## 🆘 Troubleshooting

### Domain Not Working?

1. **Check DNS Propagation:**
   ```bash
   dig manaskumarbehera.com
   dig www.manaskumarbehera.com
   ```

2. **Check Heroku Domains:**
   ```bash
   heroku domains -a manaskumarbehera
   ```

3. **Check SSL:**
   ```bash
   heroku certs:auto -a manaskumarbehera
   ```

4. **Online DNS Check:**
   - https://www.whatsmydns.net/#A/manaskumarbehera.com
   - https://www.whatsmydns.net/#CNAME/www.manaskumarbehera.com

### SSL Not Working?

1. Ensure DNS is properly configured first
2. Wait for DNS propagation (up to 48 hours)
3. Run: `heroku certs:auto -a manaskumarbehera`

### Email Not Forwarding?

1. Check Google Domains email settings
2. Verify the forwarding address in your Gmail
3. Check spam folder

---

## 📝 Change Log

| Date | Change |
|------|--------|
| Feb 14, 2026 | Domain purchased from Google Domains |
| Feb 14, 2026 | Added to Heroku app `manaskumarbehera` |
| Feb 14, 2026 | SSL enabled via Heroku ACM |
| Feb 14, 2026 | DNS configured in Google Domains |

---

## 🏗️ Future Subdomains (Optional)

If you want to add subdomains in the future:

| Subdomain | Purpose | Example |
|-----------|---------|---------|
| `blog.manaskumarbehera.com` | Blog/Articles | WordPress, Ghost |
| `api.manaskumarbehera.com` | API endpoint | Backend services |
| `dev.manaskumarbehera.com` | Development/Staging | Testing |
| `mail.manaskumarbehera.com` | Email server | Custom email |

### To Add a Subdomain:
```bash
# 1. Add to Heroku
heroku domains:add blog.manaskumarbehera.com -a manaskumarbehera

# 2. Get DNS target
heroku domains -a manaskumarbehera

# 3. Add CNAME in Google Domains
# Host: blog
# Type: CNAME
# Data: [dns-target].herokudns.com
```

---

## ✅ Checklist

- [x] Domain purchased (manaskumarbehera.com)
- [x] Domain added to Heroku
- [x] WWW subdomain added to Heroku
- [x] SSL enabled (Heroku ACM)
- [ ] DNS records configured in Google Domains
- [ ] DNS propagation complete
- [ ] Site accessible via https://manaskumarbehera.com
- [ ] Site accessible via https://www.manaskumarbehera.com
- [ ] Email forwarding set up (optional)

---

**Domain Owner:** Manas Kumar Behera  
**Contact:** behera.manas98@gmail.com

