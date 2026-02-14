# Domain Recommendations for Manas Kumar Behera

## 🎯 Recommended Setup

### Heroku App Name
**Recommended:** `manas-behera-dev`

**Command to create:**
```bash
heroku create manas-behera-dev
```

**Your URL will be:** 
https://manas-behera-dev.herokuapp.com

### Alternative Heroku Names (if taken):
- `manaskumarbehera`
- `mkbehera-portfolio`
- `manas-salesforce-dev`
- `mkb-developer`

---

## 🌐 Domain Name Strategy

### Primary Recommendation
**Domain:** `manaskumarbehera.com`
**Why:** Professional, personal brand, easy to remember
**Where to buy:** Namecheap.com
**Cost:** ~$10-12/year

### Check Availability
Visit these sites to check if available:
1. https://www.namecheap.com/domains/registration/results/?domain=manaskumarbehera.com
2. https://domains.google.com/registrar/search?searchTerm=manaskumarbehera.com

### Alternative Domains (if .com is taken)
1. `manaskumarbehera.dev` - Perfect for developers! (~$12/year)
2. `manasbehera.com` - Shorter version
3. `manasbehera.io` - Tech-focused (~$35/year)
4. `mkbehera.com` - Using initials
5. `manasdev.com` - Developer focused

---

## 💳 Where to Buy - Quick Comparison

| Registrar | .com Price | .dev Price | Best For | Link |
|-----------|-----------|-----------|----------|------|
| **Namecheap** ⭐ | $8-10/yr | $12/yr | Best value | namecheap.com |
| **Cloudflare** | $8-9/yr | $10/yr | Cheapest, tech users | cloudflare.com |
| **Google Domains** | $12/yr | $12/yr | Easy to use | domains.google.com |
| **Porkbun** | $9-11/yr | $12/yr | Good balance | porkbun.com |
| **GoDaddy** | $12-20/yr | $15/yr | Popular choice | godaddy.com |

---

## 📋 Step-by-Step Purchase Guide

### Using Namecheap (Recommended)

**Step 1: Check Availability**
```
1. Go to: https://www.namecheap.com
2. Type in search: manaskumarbehera.com
3. Click Search
4. See if available (green checkmark)
```

**Step 2: Add to Cart**
```
1. Click "Add to Cart" on your chosen domain
2. Select duration: 1 year (you can renew)
3. FREE extras included:
   - WhoisGuard (privacy protection) ✓
   - Email forwarding ✓
```

**Step 3: Create Account & Checkout**
```
1. Create Namecheap account (or login)
2. Enter payment details
3. Total cost: ~$10-15 for first year
4. Complete purchase
```

**Step 4: Configure for Heroku (After Purchase)**
```
Wait 24 hours, then follow these steps:
1. Login to Namecheap
2. Manage your domain
3. Advanced DNS settings
4. Add CNAME record pointing to Heroku
   (Full instructions in DEPLOYMENT.md)
```

---

## 🚀 Quick Setup After Purchase

### 1. Deploy to Heroku First
```bash
cd /Users/manas/IdeaProjects/MyDeveloperProfile
heroku create manas-behera-dev
git push heroku main
```

### 2. Add Custom Domain to Heroku
```bash
heroku domains:add www.manaskumarbehera.com
heroku domains:add manaskumarbehera.com
```

### 3. Get DNS Target
```bash
heroku domains
# Copy the DNS target (looks like: xxx.herokudns.com)
```

### 4. Update Namecheap DNS
```
In Namecheap:
- Add CNAME record: www → [your-heroku-dns-target]
- Add ALIAS/ANAME: @ → [your-heroku-dns-target]
```

### 5. Enable SSL (Automatic)
```bash
heroku certs:auto:enable
```

---

## 💡 My Personal Recommendation

### For You (Manas Kumar Behera):

**Heroku App Name:**
```bash
heroku create manas-behera-dev
```

**Domain Name to Buy:**
**First Choice:** `manaskumarbehera.com`
**Second Choice:** `manaskumarbehera.dev` (if .com taken)

**Where to Buy:**
**Namecheap** - Best balance of price and features

**Budget:**
- Domain: $10-12/year
- Heroku: Free tier (or $7/month for Hobby dyno)
- Total Year 1: ~$10-100 depending on Heroku tier

---

## ✅ Action Plan

**Right Now:**
1. Check domain availability at Namecheap.com
2. If available, purchase `manaskumarbehera.com`
3. Enable WhoisGuard for privacy (free)

**After Purchase:**
1. Deploy to Heroku: `heroku create manas-behera-dev`
2. Push code: `git push heroku main`
3. Add custom domain: `heroku domains:add`
4. Update DNS at Namecheap
5. Wait 24-48 hours for DNS propagation
6. Your site will be live at www.manaskumarbehera.com!

---

## 🔗 Quick Links

**Check Domain Availability:**
- https://www.namecheap.com/domains/registration/results/?domain=manaskumarbehera
- https://domains.google.com/registrar/search?searchTerm=manaskumarbehera

**Heroku Domain Setup Guide:**
- See DEPLOYMENT.md in your project folder

**DNS Propagation Check:**
- https://www.whatsmydns.net (check if DNS is working worldwide)

---

## 📞 Need Help?

**Domain Questions:**
- Namecheap Live Chat (24/7)
- Their knowledge base is excellent

**Heroku Questions:**
- Check DEPLOYMENT.md
- Heroku documentation: https://devcenter.heroku.com/articles/custom-domains

---

## 💰 Estimated Costs

**Setup (One-time):**
- Domain registration: $10-15
- Time investment: 30-60 minutes

**Annual Costs:**
- Domain renewal: $10-15/year
- Heroku Free tier: $0
- Heroku Hobby tier: $84/year ($7/month)

**Total Year 1:**
- Minimal: ~$10 (domain only, free Heroku)
- Recommended: ~$95 (domain + Hobby Heroku)

---

**Good luck, Manas! Your portfolio will look great at manaskumarbehera.com! 🚀**

