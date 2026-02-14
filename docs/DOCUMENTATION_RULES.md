# Documentation Organization Rules

## 📚 Documentation Structure Rules

### Rule 1: All Documentation Goes in `docs/` Folder

**Rule:** All `.md` documentation files MUST be placed in the `docs/` directory.

**Exceptions (allowed in root):**
- `README.md` - Main project README
- `PROJECT_STRUCTURE.md` - Project structure guide
- `ORGANIZATION_COMPLETE.md` - Organization summary

**Examples:**
```bash
# ✅ Correct
docs/DEPLOYMENT.md
docs/CUSTOMIZATION.md
docs/TROUBLESHOOTING.md

# ❌ Wrong
DEPLOYMENT.md
CUSTOMIZATION.md
TROUBLESHOOTING.md
```

### Rule 2: Naming Convention

**Documentation files should:**
- Use UPPERCASE for file names (e.g., `DEPLOYMENT.md`)
- Be descriptive and clear (e.g., `TROUBLESHOOTING.md` not `HELP.md`)
- Follow existing naming patterns

**Examples:**
```bash
# ✅ Good names
docs/DEPLOYMENT_GUIDE.md
docs/QUICK_START.md
docs/API_DOCUMENTATION.md

# ❌ Poor names
docs/doc1.md
docs/stuff.md
docs/notes.md
```

### Rule 3: Documentation Index

**Rule:** `docs/README.md` serves as the documentation index.

**Requirements:**
- Must list all documentation files
- Should categorize docs by topic
- Include brief descriptions
- Provide links to all files

### Rule 4: Git Hook Enforcement

**A pre-commit hook automatically checks:**
1. No new `.md` files in root (except allowed ones)
2. Documentation structure is maintained
3. Warns if removing docs from `docs/` folder

**Location:** `.git/hooks/pre-commit`

**To bypass (not recommended):**
```bash
git commit --no-verify
```

### Rule 5: Documentation Updates

**When adding new documentation:**
1. Create file in `docs/` folder
2. Update `docs/README.md` index
3. Add reference in main `README.md` if needed
4. Use npm script: `npm run commit:docs`

**Example workflow:**
```bash
# Create new doc
echo "# New Guide" > docs/NEW_GUIDE.md

# Update index
# Edit docs/README.md to add link

# Commit
npm run commit:docs
```

## 🔧 Enforcement Mechanisms

### 1. Git Pre-commit Hook

Located at: `.git/hooks/pre-commit`

**What it does:**
- Checks for `.md` files being added to root
- Validates against allowed files list
- Prevents commit if rules are violated
- Suggests correct location

### 2. NPM Scripts

**Documentation-specific scripts:**
```bash
npm run commit:docs      # Commit only docs/ changes
npm run check:docs       # Count documentation files
```

### 3. Build Script Validation

The build script (`scripts/build.sh`) verifies:
- `docs/` folder exists
- Minimum number of documentation files present
- Documentation structure is intact

## 📋 Checklist for New Documentation

When creating new documentation:

- [ ] File is created in `docs/` folder
- [ ] File name follows UPPERCASE convention
- [ ] File is descriptive and clear
- [ ] `docs/README.md` is updated with link
- [ ] Main `README.md` updated if major doc
- [ ] Committed using `npm run commit:docs`
- [ ] Pre-commit hook passed

## 🚫 Common Mistakes to Avoid

### ❌ DON'T:
```bash
# Don't create docs in root
touch GUIDE.md
git add GUIDE.md

# Don't use unclear names
touch docs/doc1.md

# Don't skip the index update
# Create new doc but forget to update docs/README.md
```

### ✅ DO:
```bash
# Create docs in correct location
touch docs/NEW_GUIDE.md

# Use clear, descriptive names
touch docs/DEPLOYMENT_TROUBLESHOOTING.md

# Always update the index
# Edit docs/README.md after creating new doc

# Use npm scripts
npm run commit:docs
```

## 🔍 Verification

### Check Documentation Structure

```bash
# View all documentation
ls -la docs/

# Count documentation files
npm run check:docs

# Verify index is updated
cat docs/README.md
```

### Test Git Hook

```bash
# Try to add a doc to root (should fail)
echo "# Test" > TEST_DOC.md
git add TEST_DOC.md
git commit -m "Test"
# Should see error message

# Clean up
rm TEST_DOC.md
```

## 📊 Current Documentation Structure

```
MyDeveloperProfile/
├── README.md                       # ✅ Allowed in root
├── PROJECT_STRUCTURE.md           # ✅ Allowed in root
├── ORGANIZATION_COMPLETE.md       # ✅ Allowed in root
└── docs/                          # 📚 All other docs here
    ├── README.md                  # Documentation index
    ├── START_HERE_MANAS.md
    ├── DEPLOYMENT.md
    ├── QUICK_START.md
    ├── TROUBLESHOOTING.md
    ├── CUSTOMIZATION.md
    ├── WEBSITE_PREVIEW.md
    ├── DEPLOYMENT_VISUAL_GUIDE.md
    ├── DEPLOYMENT_SUCCESS.md
    ├── DOMAIN_SETUP_GUIDE.md
    ├── PROJECT_SUMMARY.md
    ├── DOCUMENTATION_INDEX.md
    └── LINKS_UPDATED.md
```

## 🎯 Benefits of This Structure

1. **Clean Root Directory**
   - Only essential files in root
   - Easy to navigate
   - Professional appearance

2. **Organized Documentation**
   - All docs in one place
   - Easy to find information
   - Logical grouping

3. **Automatic Enforcement**
   - Git hooks prevent mistakes
   - Build scripts validate structure
   - NPM scripts simplify workflows

4. **Easy Maintenance**
   - Clear location for all docs
   - Simple to add new documentation
   - Index keeps everything tracked

## 🔄 Migration Guide

If you have documentation in the wrong location:

```bash
# 1. Move to correct location
git mv WRONG_LOCATION.md docs/

# 2. Update index
# Edit docs/README.md

# 3. Commit
git commit -m "Moved documentation to docs/ folder"
```

## 📞 Help

**If pre-commit hook blocks you:**
1. Check which files are causing issues
2. Move them to `docs/` folder
3. Update `docs/README.md`
4. Try commit again

**If you must bypass (emergency only):**
```bash
git commit --no-verify -m "Emergency commit"
```

But please fix the structure afterwards!

---

**These rules ensure your portfolio maintains a professional, organized structure.** 📚

**All documentation belongs in `docs/` - no exceptions!** ✨

