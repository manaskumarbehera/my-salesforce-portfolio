# Domain Setup Guide - manaskumarbehera.com

## ✅ Domain Purchased

**Domain:** `manaskumarbehera.com`  
**Registrar:** Squarespace Domains  
**DNS Settings:** https://account.squarespace.com/domains/managed/manaskumarbehera.com/dns/dns-settings  
**Heroku App:** `manaskumarbehera`  
**Region:** EU (Europe) 🇪🇺

---

## 🚨 ACTION REQUIRED: Update DNS in Squarespace

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
- [ ] **A records added in Google Domains** ⬅️ DO THIS NOW
- [ ] **CNAME record added for www** ⬅️ DO THIS NOW
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

---

## 🔗 Useful Links

- **Squarespace Domain Dashboard:** https://account.squarespace.com/domains/managed/manaskumarbehera.com
- **DNS Settings:** https://account.squarespace.com/domains/managed/manaskumarbehera.com/dns/dns-settings
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

