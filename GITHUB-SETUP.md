# 🚀 GitHub Setup Guide

## ✅ What's Done

Your project is ready for GitHub! Git repository initialized with:
- ✅ 78 files committed
- ✅ 22,217 lines of code
- ✅ Complete NRI Wealth Partners website
- ✅ Proper .gitignore file
- ✅ All documentation included

---

## 📦 Push to GitHub

### Step 1: Create GitHub Repository

1. **Go to GitHub:**
   - Visit https://github.com
   - Sign in to your account

2. **Create New Repository:**
   - Click the **"+"** icon (top right)
   - Select **"New repository"**

3. **Repository Details:**
   - **Repository name:** `nri-wealth-partners`
   - **Description:** `Professional wealth management website for Non-Resident Indians - Built with Next.js 14`
   - **Visibility:**
     - Choose **Private** (recommended for business website)
     - Or **Public** (if you want open source)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
   - Click **"Create repository"**

### Step 2: Connect Local Repo to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
cd ~/Projects/NRIWealthPartners

# Add GitHub as remote origin
git remote add origin https://github.com/YOUR-USERNAME/nri-wealth-partners.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

**Replace `YOUR-USERNAME`** with your actual GitHub username!

### Step 3: Verify Upload

1. Refresh your GitHub repository page
2. You should see all 78 files
3. README.md will display on the main page

---

## 🔐 Using SSH Instead of HTTPS (Recommended)

If you prefer SSH for better security:

### Set Up SSH Key:

```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your-email@example.com"

# Start SSH agent
eval "$(ssh-agent -s)"

# Add SSH key
ssh-add ~/.ssh/id_ed25519

# Copy SSH public key
cat ~/.ssh/id_ed25519.pub
```

### Add to GitHub:

1. Go to GitHub → Settings → SSH and GPG keys
2. Click "New SSH key"
3. Paste the key you copied
4. Click "Add SSH key"

### Use SSH Remote:

```bash
git remote add origin git@github.com:YOUR-USERNAME/nri-wealth-partners.git
git branch -M main
git push -u origin main
```

---

## 📁 Repository Structure

Your GitHub repo will contain:

```
nri-wealth-partners/
├── app/                          # Next.js pages
│   ├── about/
│   ├── services/
│   ├── calculators/
│   ├── resources/
│   ├── resources-library/
│   ├── webinars/
│   ├── contact/
│   └── api/
├── components/                   # React components
│   ├── calculators/              # 10 financial calculators
│   ├── forms/
│   ├── navigation/
│   ├── sections/
│   └── ui/
├── public/                       # Static assets
│   └── images/
├── lib/                          # Utilities
├── *.md                         # Documentation files
├── .gitignore
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔄 Making Future Updates

After making changes to your code:

```bash
# Check what files changed
git status

# Stage all changes
git add .

# Commit with a message
git commit -m "Description of what you changed"

# Push to GitHub
git push
```

### Commit Message Best Practices:

Good commit messages:
- ✅ `Add tax calculator with old vs new regime comparison`
- ✅ `Fix header logo sizing on mobile devices`
- ✅ `Update webinar page with December schedule`
- ✅ `Improve Resources page with actual PDF links`

Bad commit messages:
- ❌ `Update`
- ❌ `Fix`
- ❌ `Changes`

---

## 🌿 Working with Branches

For major changes, use branches:

```bash
# Create new branch for feature
git checkout -b feature/new-calculator

# Make changes and commit
git add .
git commit -m "Add mutual fund SWP calculator"

# Push branch to GitHub
git push -u origin feature/new-calculator

# On GitHub, create Pull Request to merge into main
```

---

## 👥 Collaborating with Team

### Adding Collaborators:

1. Go to your GitHub repo
2. Click **Settings** → **Collaborators**
3. Click **Add people**
4. Enter their GitHub username or email
5. They'll receive an invitation

### Managing Access:

- **Admin**: Full access (you)
- **Write**: Can push changes (developers)
- **Read**: Can view only (reviewers)

---

## 🔒 Protecting Your Main Branch

Prevent accidental changes to production:

1. Go to repo **Settings** → **Branches**
2. Click **Add branch protection rule**
3. Branch name pattern: `main`
4. Enable:
   - ✅ Require pull request before merging
   - ✅ Require approvals (if team)
   - ✅ Include administrators (optional)
5. Click **Create**

Now all changes must go through Pull Requests!

---

## 📝 .env Files and Secrets

**IMPORTANT:** Never commit `.env.local` to GitHub!

Your `.gitignore` already excludes:
- ✅ `.env*.local`
- ✅ `.env.local`
- ✅ `.env.development.local`
- ✅ `.env.production.local`

### For Team Members:

1. Share `.env.example` in the repo (without actual values)
2. Team members copy it to `.env.local` and fill in their own values
3. Use GitHub Secrets for deployment (covered in Google Cloud guide)

---

## 🏷️ Creating Releases

When ready to deploy:

```bash
# Tag your current version
git tag -a v1.0.0 -m "Initial production release"

# Push tag to GitHub
git push origin v1.0.0
```

On GitHub:
1. Go to **Releases** → **Create a new release**
2. Choose the tag: `v1.0.0`
3. Release title: `v1.0.0 - Initial Launch`
4. Description: List major features
5. Click **Publish release**

---

## 📊 GitHub Features to Use

### 1. **Issues**
Track bugs, feature requests, tasks:
- Go to **Issues** → **New issue**
- Use labels: `bug`, `enhancement`, `documentation`
- Assign to team members
- Track progress

### 2. **Projects**
Organize work in Kanban boards:
- Go to **Projects** → **New project**
- Create columns: To Do, In Progress, Done
- Link issues to cards

### 3. **Actions** (CI/CD)
Automate testing and deployment:
- Automatically run tests on push
- Auto-deploy to Google Cloud
- We'll set this up in the Google Cloud guide

### 4. **Wiki**
Create documentation wiki:
- Go to **Wiki** tab
- Create pages for:
  - Setup instructions
  - Feature documentation
  - Deployment process

---

## 🔗 Useful GitHub URLs

After setup, you'll have:

- **Repository**: `https://github.com/YOUR-USERNAME/nri-wealth-partners`
- **Clone URL (HTTPS)**: `https://github.com/YOUR-USERNAME/nri-wealth-partners.git`
- **Clone URL (SSH)**: `git@github.com:YOUR-USERNAME/nri-wealth-partners.git`
- **Issues**: `https://github.com/YOUR-USERNAME/nri-wealth-partners/issues`
- **Actions**: `https://github.com/YOUR-USERNAME/nri-wealth-partners/actions`

---

## 🆘 Common Issues & Solutions

### Issue: "Permission denied"
**Solution:** Use SSH or provide GitHub credentials (token)

```bash
# Use Personal Access Token instead of password
# Generate at: GitHub → Settings → Developer settings → Personal access tokens
```

### Issue: "Repository not found"
**Solution:** Check repository name and your access

```bash
# Verify remote URL
git remote -v

# Update remote URL if wrong
git remote set-url origin https://github.com/CORRECT-USERNAME/nri-wealth-partners.git
```

### Issue: "Merge conflicts"
**Solution:** Pull latest changes before pushing

```bash
git pull origin main
# Resolve conflicts in files
git add .
git commit -m "Resolve merge conflicts"
git push
```

### Issue: "Large files rejected"
**Solution:** GitHub has 100MB file limit

```bash
# Check large files
find . -type f -size +50M

# Add to .gitignore and remove from tracking
echo "large-file.zip" >> .gitignore
git rm --cached large-file.zip
git commit -m "Remove large file"
```

---

## ✅ Post-Setup Checklist

After pushing to GitHub:

- [ ] Repository is created on GitHub
- [ ] Code is pushed to main branch
- [ ] README.md displays correctly
- [ ] All files are visible (78 files)
- [ ] .env.local is NOT in the repository (check!)
- [ ] Repository description is set
- [ ] Topics/tags added (nextjs, react, typescript, tailwind, finance)
- [ ] License file added (if needed)
- [ ] Branch protection enabled (optional)
- [ ] Collaborators invited (if team project)

---

## 🚀 Next Steps

1. ✅ Push code to GitHub (follow steps above)
2. 📖 Read `GOOGLE-CLOUD-DEPLOYMENT.md` for production deployment
3. 🔄 Set up GitHub Actions for auto-deployment
4. 📊 Create first issue for future enhancements
5. 🏷️ Create v1.0.0 release when ready for production

---

**Your code is ready for GitHub!**

Follow the steps above and your NRI Wealth Partners website will be safely stored and version-controlled on GitHub.

Questions? Check the troubleshooting section or create an issue in this repository.
