# Domain Setup Guide - manaskumarbehera.com

## ✅ Domain Purchased

**Domain:** `manaskumarbehera.com`  
**Registrar:** Google Domains (domains.google.com)  
**Heroku App:** `manas-behera-dev`

---

## 🚀 Step-by-Step Setup (Google Domains + Heroku)

### Step 1: Add Custom Domain to Heroku

Open terminal and run these commands:

```bash
# Add root domain
heroku domains:add manaskumarbehera.com -a manas-behera-dev

# Add www subdomain
heroku domains:add www.manaskumarbehera.com -a manas-behera-dev
```

### Step 2: Get Your Heroku DNS Targets

```bash
heroku domains -a manas-behera-dev
```

This will show something like:
```
Domain Name                  DNS Record Type  DNS Target
───────────────────────────  ───────────────  ─────────────────────────────────
manaskumarbehera.com         ALIAS or ANAME   sleepy-example-12345.herokudns.com
www.manaskumarbehera.com     CNAME            sleepy-example-67890.herokudns.com
```

**Copy both DNS Target values** - you'll need them for Google Domains.

### Step 3: Configure DNS in Google Domains

1. Go to: https://domains.google.com/registrar/manaskumarbehera.com/dns
2. Login to your Google account
3. Click on **DNS** in the left sidebar
4. Select **"Manage custom records"** or **"Custom records"**

#### Add these DNS records:

| Host Name | Type | TTL | Data |
|-----------|------|-----|------|
| `@` | A | 3600 | `75.2.60.5` |
| `@` | A | 3600 | `99.80.186.122` |
| `www` | CNAME | 3600 | `[your-www-dns-target].herokudns.com` |

**Note:** Replace `[your-www-dns-target].herokudns.com` with the actual DNS target from Step 2.

#### Alternative (if A records don't work):

| Host Name | Type | TTL | Data |
|-----------|------|-----|------|
| `www` | CNAME | 3600 | `[your-www-dns-target].herokudns.com` |

Then set up a redirect from `manaskumarbehera.com` to `www.manaskumarbehera.com` in Google Domains.

### Step 4: Enable SSL on Heroku

```bash
heroku certs:auto:enable -a manas-behera-dev
```

### Step 5: Wait for DNS Propagation

DNS changes can take **15 minutes to 48 hours** to propagate worldwide.

**Check propagation status:**
- https://www.whatsmydns.net/#A/manaskumarbehera.com
- https://www.whatsmydns.net/#CNAME/www.manaskumarbehera.com

### Step 6: Verify Your Domain

```bash
# Check if domain is configured correctly
heroku domains -a manas-behera-dev

# Check SSL certificate status
heroku certs:auto -a manas-behera-dev
```

---

## 🔧 Quick Commands Reference

```bash
# Add domains
heroku domains:add manaskumarbehera.com -a manas-behera-dev
heroku domains:add www.manaskumarbehera.com -a manas-behera-dev

# View domains and DNS targets
heroku domains -a manas-behera-dev

# Enable automatic SSL
heroku certs:auto:enable -a manas-behera-dev

# Check SSL status
heroku certs:auto -a manas-behera-dev

# Remove a domain (if needed)
heroku domains:remove manaskumarbehera.com -a manas-behera-dev
```

---

## 📧 Set Up Email Forwarding (Optional)

Google Domains offers free email forwarding!

1. Go to: https://domains.google.com/registrar/manaskumarbehera.com/email
2. Click **"Email forwarding"**
3. Add forwarding address:
   - **Alias:** `web@manaskumarbehera.com`
   - **Forward to:** `behera.manas98@gmail.com`
4. Click **Add**
5. Verify by clicking the link sent to your Gmail

Now `web@manaskumarbehera.com` will forward to your Gmail!

---

## ✅ Checklist

- [ ] Heroku domains added (`heroku domains:add`)
- [ ] DNS targets copied from Heroku
- [ ] A records added in Google Domains (pointing to Heroku IPs)
- [ ] CNAME record added for www subdomain
- [ ] SSL enabled (`heroku certs:auto:enable`)
- [ ] Wait 15-48 hours for DNS propagation
- [ ] Test https://manaskumarbehera.com
- [ ] Test https://www.manaskumarbehera.com
- [ ] (Optional) Email forwarding set up

---

## 🆘 Troubleshooting

### Domain not working after 48 hours?

1. **Check DNS records are correct:**
   ```bash
   dig manaskumarbehera.com
   dig www.manaskumarbehera.com
   ```

2. **Verify Heroku configuration:**
   ```bash
   heroku domains -a manas-behera-dev
   ```

3. **Check SSL status:**
   ```bash
   heroku certs:auto -a manas-behera-dev
   ```

### SSL Certificate not issued?

Make sure DNS is properly configured first. Heroku won't issue SSL until DNS is verified.

```bash
# Check ACM (Automated Certificate Management) status
heroku certs:auto -a manas-behera-dev
```

---

## 🔗 Useful Links

- **Google Domains Dashboard:** https://domains.google.com/registrar/manaskumarbehera.com
- **DNS Settings:** https://domains.google.com/registrar/manaskumarbehera.com/dns
- **Email Forwarding:** https://domains.google.com/registrar/manaskumarbehera.com/email
- **Heroku Custom Domains Docs:** https://devcenter.heroku.com/articles/custom-domains
- **DNS Propagation Checker:** https://www.whatsmydns.net

---

## 💰 Cost Summary

| Item | Cost |
|------|------|
| Domain (manaskumarbehera.com) | ~$12/year |
| Heroku (Eco Dynos) | $5/month |
| SSL Certificate | FREE (via Heroku ACM) |
| Email Forwarding | FREE (via Google Domains) |

---

**Your site will be live at: https://manaskumarbehera.com** 🚀

