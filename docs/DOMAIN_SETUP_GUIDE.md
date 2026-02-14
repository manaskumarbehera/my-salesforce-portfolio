# Domain Setup Guide - manaskumarbehera.com

## ✅ Domain Purchased

**Domain:** `manaskumarbehera.com`  
**Registrar:** Squarespace Domains  
**DNS Settings:** https://account.squarespace.com/domains/managed/manaskumarbehera.com/dns/dns-settings  
**Heroku App:** `manaskumarbehera`  
**Region:** EU (Europe) 🇪🇺

---

## 🚨 Current Heroku Domain Configuration

Run this command to see your Heroku DNS targets:
```bash
heroku domains --app manaskumarbehera
```

**Current DNS Targets:**

| Domain | DNS Record Type | DNS Target |
|--------|-----------------|------------|
| `manaskumarbehera.com` | ALIAS or ANAME | `computational-badlands-vqbas54dog957lhao8pf7fc1.herokudns.com` |
| `www.manaskumarbehera.com` | CNAME | `theoretical-ridge-1uiuylak162l9k9363hgnqk3.herokudns.com` |

**⚠️ Problem:** Squarespace/Google Domains don't support ALIAS/ANAME records for root domains.

**✅ Solution:** Use Cloudflare (free) - see Option B below.

---

## 🅰️ Option A: Squarespace DNS (Limited - www only)

### Step 1: Open Squarespace DNS Settings

Go to: **https://account.squarespace.com/domains/managed/manaskumarbehera.com/dns/dns-settings**

### Step 2: Add/Update DNS Records

Click **"Add Record"** and add these **3 records**:

| Host Name | Type | TTL | Data |
|-----------|------|-----|------|
| `@` | A | 3600 | `75.2.60.5` |
| `@` | A | 3600 | `99.80.186.122` |
| `www` | CNAME | 3600 | `theoretical-ridge-1uiuylak162l9k9363hgnqk3.herokudns.com` |

### Step 3: How to Add Records in Squarespace

1. Click **"Add Record"** button

2. **For first A record:**
   - Host: `@`
   - Type: Select `A`
   - Data: `75.2.60.5`
   - TTL: Leave default
   - Click **Add**

3. **For second A record:**
   - Host: `@`
   - Type: Select `A`
   - Data: `99.80.186.122`
   - TTL: Leave default
   - Click **Add**

4. **For CNAME record:**
   - Host: `www`
   - Type: Select `CNAME`
   - Data: `theoretical-ridge-1uiuylak162l9k9363hgnqk3.herokudns.com`
   - TTL: Leave default
   - Click **Add**

### Step 4: Verify DNS Records

After adding, your records should look like this:

```
┌─────────────┬───────┬──────┬─────────────────────────────────────────────────────────────┐
│ Host name   │ Type  │ TTL  │ Data                                                        │
├─────────────┼───────┼──────┼─────────────────────────────────────────────────────────────┤
│ @           │ A     │ 3600 │ 75.2.60.5                                                   │
│ @           │ A     │ 3600 │ 99.80.186.122                                               │
│ www         │ CNAME │ 3600 │ theoretical-ridge-1uiuylak162l9k9363hgnqk3.herokudns.com    │
└─────────────┴───────┴──────┴─────────────────────────────────────────────────────────────┘
```

### Step 5: Wait for DNS Propagation

DNS changes take **15 minutes to 48 hours** to propagate worldwide.

**Check propagation status:**
- https://www.whatsmydns.net/#A/manaskumarbehera.com
- https://www.whatsmydns.net/#CNAME/www.manaskumarbehera.com

### Step 6: Test Your Domain

After propagation, test these URLs:
- ✅ https://manaskumarbehera.com
- ✅ https://www.manaskumarbehera.com

---

## 🔧 Heroku Commands Reference

```bash
# View domains and DNS targets
heroku domains -a manaskumarbehera

# Check SSL status
heroku certs:auto -a manaskumarbehera

# View app info
heroku info -a manaskumarbehera

# View logs
heroku logs --tail -a manaskumarbehera
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

- [x] Heroku app created in EU region (`manaskumarbehera`)
- [x] Custom domains added to Heroku
- [x] SSL enabled (Heroku ACM)
- [ ] **Set up Cloudflare DNS** ⬅️ RECOMMENDED
  - [ ] Create Cloudflare account (free)
  - [ ] Add domain to Cloudflare
  - [ ] Add CNAME records for `@` and `www`
  - [ ] Update nameservers in Squarespace/Google Domains
- [ ] Wait 24-48 hours for DNS propagation
- [ ] Test https://manaskumarbehera.com
- [ ] Test https://www.manaskumarbehera.com
- [ ] Verify SSL certificate issued (ACM status: OK)
- [ ] (Optional) Email forwarding set up

---

## ☁️ Option B: Use Cloudflare DNS (Recommended for ALIAS/ANAME Support)

Squarespace and Google Domains **do not support ALIAS/ANAME records** for root domains. Cloudflare offers **free CNAME flattening** which solves this problem.

### Why Cloudflare?

- ✅ Free CNAME flattening (works like ALIAS/ANAME)
- ✅ Free SSL certificates
- ✅ DDoS protection
- ✅ CDN for faster loading
- ✅ Analytics

### Step 1: Create Cloudflare Account

1. Go to https://cloudflare.com
2. Click **Sign Up** (it's free)
3. Create account with your email

### Step 2: Add Your Domain to Cloudflare

1. Click **"Add a Site"**
2. Enter: `manaskumarbehera.com`
3. Select **Free plan** → Click **Continue**
4. Cloudflare will scan existing DNS records

### Step 3: Configure DNS Records in Cloudflare

Delete any auto-imported records and add these:

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| CNAME | `@` | `computational-badlands-vqbas54dog957lhao8pf7fc1.herokudns.com` | Proxied (orange cloud) |
| CNAME | `www` | `theoretical-ridge-1uiuylak162l9k9363hgnqk3.herokudns.com` | Proxied (orange cloud) |

**Note:** For root domain (`@`), Cloudflare automatically uses CNAME flattening.

### Step 4: Update Nameservers

Cloudflare will provide two nameservers like:
```
adam.ns.cloudflare.com
bella.ns.cloudflare.com
```

**In Squarespace Domains:**
1. Go to https://account.squarespace.com/domains/managed/manaskumarbehera.com/dns/dns-settings
2. Look for **"Nameservers"** or **"Use custom nameservers"**
3. Replace with Cloudflare nameservers
4. Save changes

**In Google Domains (if using):**
1. Go to https://domains.google.com → `manaskumarbehera.com`
2. Click **DNS** in left sidebar
3. Select **Custom name servers**
4. Add Cloudflare nameservers
5. Click **Save**

### Step 5: Configure SSL/TLS in Cloudflare

1. Go to **SSL/TLS** in Cloudflare dashboard
2. Set mode to **Full (strict)**
3. This ensures end-to-end encryption

### Step 6: Wait for Propagation

- Nameserver changes take **24-48 hours**
- Check status in Cloudflare dashboard (will show "Active" when ready)

### Step 7: Verify Setup

```bash
# Check root domain
dig manaskumarbehera.com

# Check www subdomain  
dig www.manaskumarbehera.com

# Test HTTPS
curl -I https://manaskumarbehera.com
curl -I https://www.manaskumarbehera.com
```

### Cloudflare Dashboard URLs

- **DNS Settings:** https://dash.cloudflare.com → manaskumarbehera.com → DNS
- **SSL/TLS:** https://dash.cloudflare.com → manaskumarbehera.com → SSL/TLS
- **Analytics:** https://dash.cloudflare.com → manaskumarbehera.com → Analytics

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
   heroku domains -a manaskumarbehera
   ```

3. **Check SSL status:**
   ```bash
   heroku certs:auto -a manaskumarbehera
   ```

### SSL Certificate not issued?

Make sure DNS is properly configured first. Heroku won't issue SSL until DNS is verified.

```bash
# Check ACM (Automated Certificate Management) status
heroku certs:auto -a manaskumarbehera
```

### ACM Error: "CDN not returning HTTP challenge"

This error means DNS is not properly pointing to Heroku. Common causes:

1. **Root domain using wrong DNS provider** - Squarespace/Google Domains don't support ALIAS/ANAME
2. **DNS still pointing to old servers** - Check with `dig manaskumarbehera.com`
3. **DNS propagation not complete** - Wait 24-48 hours

**Fix:** Use Cloudflare DNS (see Option B above) which supports CNAME flattening for root domains.

### Heroku ACM Commands

```bash
# Check ACM status
heroku certs:auto -a manaskumarbehera

# Refresh ACM (force retry)
heroku certs:auto:refresh -a manaskumarbehera

# View detailed cert info
heroku certs:info -a manaskumarbehera
```

---

## 🔗 Useful Links

- **Cloudflare Dashboard:** https://dash.cloudflare.com
- **Cloudflare DNS Docs:** https://developers.cloudflare.com/dns/
- **Squarespace Domain Dashboard:** https://account.squarespace.com/domains/managed/manaskumarbehera.com
- **DNS Settings:** https://account.squarespace.com/domains/managed/manaskumarbehera.com/dns/dns-settings
- **Heroku Custom Domains Docs:** https://devcenter.heroku.com/articles/custom-domains
- **Heroku ACM (SSL) Docs:** https://devcenter.heroku.com/articles/automated-certificate-management
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

