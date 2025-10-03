# 🚀 Deployment Instructions

## Push to GitHub: https://github.com/Jita81/Claude-Desktop---Azure-DevOps-MCP

### Step 1: Initialize Git Repository

```bash
cd /Users/paul.glover/Documents/Repos/ADOMCP4/azure-devops-mcp

# Initialize git if not already done
git init

# Add all files (secrets protected by .gitignore)
git add .

# Check what will be committed (VERIFY NO SECRETS!)
git status
```

### Step 2: Verify No Secrets Are Included

**CRITICAL**: Before committing, verify:

```bash
# Search for any PAT tokens (should return nothing)
git diff --cached | grep -i "CVJa"

# Search for org names (should return nothing)
git diff --cached | grep -i "GenerativeAILab"

# Search for project names (should return nothing)  
git diff --cached | grep -i "MCPTest"
```

**If ANY of these return results, DO NOT COMMIT!** Check what file contains secrets and add it to `.gitignore`.

### Step 3: Commit Your Changes

```bash
git commit -m "Add PAT authentication support to Azure DevOps MCP Server

- Add Personal Access Token (PAT) authentication option
- Update auth.ts to support 'pat' authentication type
- Update connection handler to use PAT with Basic auth
- Add comprehensive README for PAT setup
- No more browser popups for authentication!"
```

### Step 4: Add Remote and Push

```bash
# Add the GitHub remote
git remote add origin https://github.com/Jita81/Claude-Desktop---Azure-DevOps-MCP.git

# Push to main branch
git branch -M main
git push -u origin main
```

### Step 5: Update README on GitHub

After pushing, rename `README-PAT.md` to `README.md` on GitHub (or locally):

```bash
# Option 1: Rename locally and push
mv README-PAT.md README.md
git add README.md
git commit -m "Set PAT-focused README as main README"
git push
```

---

## ✅ Pre-Push Checklist

Before pushing, verify:

- [ ] No Personal Access Tokens in any files
- [ ] No organization names (GenerativeAILab) in source files
- [ ] No project names (MCPTest) in source files  
- [ ] No API keys or credentials
- [ ] `.gitignore` is properly configured
- [ ] `manifest.json` has no default values for sensitive fields
- [ ] All example configs use placeholder values (YOUR_ORG, YOUR_PAT, etc.)

---

## 🔒 Security Notes

The following files are protected by `.gitignore`:
- `claude_desktop_config.json` (contains your PAT)
- Any file matching `*config*.json`
- Any file containing "secret", "credentials", "token", "pat"

Always double-check before committing!
