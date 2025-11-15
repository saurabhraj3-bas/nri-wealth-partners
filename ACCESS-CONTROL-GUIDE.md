# 🔐 Access Control & Team Management Guide

Complete guide for managing team access and permissions for NRI Wealth Partners website.

---

## 🎯 Overview

This guide helps you set up proper access control for different team members based on their roles and responsibilities.

**Why access control matters**:
- ✅ Security - Prevent unauthorized changes
- ✅ Efficiency - People only see what they need
- ✅ Accountability - Track who made what changes
- ✅ Compliance - Meet regulatory requirements

---

## 📋 Table of Contents

1. [Recommended Team Structure](#recommended-team-structure)
2. [GitHub Repository Access](#github-repository-access)
3. [Google Cloud Access](#google-cloud-access)
4. [Content Management System (Future)](#content-management-system)
5. [Setting Up Team Members](#setting-up-team-members)
6. [Best Practices](#best-practices)
7. [Approval Workflows](#approval-workflows)

---

## 👥 Recommended Team Structure

### Role Definitions

#### 1. **Super Admin** (You/Owner)
**Who**: Business owner, technical lead
**Access**: Full access to everything
**Responsibilities**:
- Manage all team members
- Access to Google Cloud console
- Final approval on major changes
- Access to billing and secrets
- Emergency rollback authority

**GitHub Access**: Owner
**Google Cloud Access**: Owner
**Count**: 1-2 people

---

#### 2. **Technical Admin**
**Who**: Developer, technical consultant
**Access**: Code, deployment, infrastructure
**Responsibilities**:
- Write and review code
- Deploy to production
- Configure CI/CD pipelines
- Manage environment variables
- Performance optimization
- Security updates

**GitHub Access**: Admin
**Google Cloud Access**: Editor
**Count**: 1-2 people

**What they CAN do**:
- ✅ Modify all code files
- ✅ Update dependencies
- ✅ Configure build settings
- ✅ Deploy to production
- ✅ Access Cloud Run logs
- ✅ Manage environment variables

**What they CANNOT do**:
- ❌ Delete repository
- ❌ Change billing
- ❌ Remove other admins
- ❌ Access Google Cloud billing

---

#### 3. **Content Manager**
**Who**: Marketing team, content writers
**Access**: Content files, PDFs, images
**Responsibilities**:
- Update webinar links
- Add PDF resources
- Update blog posts
- Manage testimonials
- Update service descriptions
- Change contact information

**GitHub Access**: Write (with branch protection)
**Google Cloud Access**: None (not needed)
**Count**: 2-3 people

**What they CAN do**:
- ✅ Edit content files (markdown, text)
- ✅ Upload PDFs to resources folder
- ✅ Update images
- ✅ Create pull requests
- ✅ Preview changes

**What they CANNOT do**:
- ❌ Modify code files
- ❌ Change configuration
- ❌ Deploy directly to production
- ❌ Merge to main branch (need approval)

---

#### 4. **Marketing Manager**
**Who**: Marketing lead, webinar coordinator
**Access**: Marketing content, analytics
**Responsibilities**:
- Update webinar registration links
- Manage Google Analytics
- Update meta descriptions (SEO)
- Upload marketing materials
- Update social media links

**GitHub Access**: Write (with branch protection)
**Google Cloud Access**: Analytics only
**Count**: 1-2 people

**What they CAN do**:
- ✅ Update webinar links
- ✅ Change SEO metadata
- ✅ Upload marketing PDFs
- ✅ View Google Analytics
- ✅ Update social media URLs

**What they CANNOT do**:
- ❌ Modify application code
- ❌ Deploy to production
- ❌ Access environment variables
- ❌ Change infrastructure

---

#### 5. **Reviewer/Viewer**
**Who**: Business stakeholders, compliance officer
**Access**: Read-only
**Responsibilities**:
- Review changes before approval
- Compliance checks
- Content review
- Quality assurance

**GitHub Access**: Read
**Google Cloud Access**: Viewer
**Count**: 1-2 people

**What they CAN do**:
- ✅ View all code and content
- ✅ Comment on pull requests
- ✅ View deployment history
- ✅ View analytics dashboards

**What they CANNOT do**:
- ❌ Make any changes
- ❌ Deploy anything
- ❌ Approve pull requests

---

## 🔐 GitHub Repository Access

### Access Levels Explained

| Role | GitHub Permission | What They Can Do |
|------|------------------|------------------|
| **Super Admin** | Owner | Everything, including delete repo |
| **Technical Admin** | Admin | Code, settings, merge to main |
| **Content Manager** | Write | Create branches, PRs (need approval) |
| **Marketing Manager** | Write | Create branches, PRs (need approval) |
| **Reviewer** | Read | View only, comment on PRs |

### Setting Up GitHub Access

#### Step 1: Go to Repository Settings

1. Navigate to: https://github.com/saurabhraj3-bas/nri-wealth-partners
2. Click **Settings** tab
3. Click **Collaborators and teams** (left sidebar)

#### Step 2: Invite Team Members

**For each team member**:

1. Click **Add people**
2. Enter their GitHub username or email
3. Select permission level:
   - **Admin** → Technical Admin
   - **Write** → Content/Marketing Manager
   - **Read** → Reviewer

4. Click **Add [username] to this repository**

#### Step 3: Enable Branch Protection

**Protect main branch** from direct pushes:

1. Settings → Branches
2. Click **Add branch protection rule**
3. Branch name pattern: `main`
4. Enable these settings:

```
☑ Require a pull request before merging
  ☑ Require approvals (1 approval)
  ☑ Dismiss stale pull request approvals

☑ Require status checks to pass before merging
  ☑ Require branches to be up to date

☑ Do not allow bypassing the above settings
  ☐ Allow admins to bypass (only if you trust them)

☑ Restrict who can push to matching branches
  → Add: Super Admin, Technical Admin only
```

5. Click **Create**

### Branch Protection Benefits

**What this does**:
- ✅ Content managers can't accidentally break production
- ✅ All changes must be reviewed
- ✅ Automated checks must pass
- ✅ Clear audit trail of who changed what
- ✅ Easy to revert bad changes

### Workflow with Branch Protection

**For Content Managers**:

1. **Create a new branch**:
   ```
   GitHub Desktop → Current Branch → New Branch
   Name: "update-webinar-march-2024"
   ```

2. **Make changes** in that branch

3. **Commit changes** locally

4. **Push to GitHub**

5. **Create Pull Request**:
   - Go to repository on GitHub
   - Click "Compare & pull request"
   - Add description of changes
   - Request review from Technical Admin

6. **Wait for approval**

7. **Admin merges** to main

8. **Auto-deploys** to production

---

## ☁️ Google Cloud Access

### Access Levels Explained

| Role | Cloud IAM Role | What They Can Do |
|------|---------------|------------------|
| **Super Admin** | Owner | Everything including billing |
| **Technical Admin** | Editor | Deploy, configure, view logs |
| **Marketing Manager** | Viewer + Analytics | View dashboards, access GA |
| **Others** | No Access | Not needed |

### Setting Up Google Cloud Access

#### Step 1: Open IAM Console

```
https://console.cloud.google.com/iam-admin/iam?project=nri-wealth-partners
```

#### Step 2: Add Team Members

**For Technical Admin**:

1. Click **Grant Access**
2. Enter email: `admin@example.com`
3. Select roles:
   - `Cloud Run Admin` - Deploy services
   - `Logs Viewer` - View logs
   - `Monitoring Viewer` - View metrics
4. Click **Save**

**For Marketing Manager** (Analytics only):

1. Don't add to Google Cloud
2. Instead, give Google Analytics access separately (see below)

#### Step 3: Google Analytics Access

1. Go to: https://analytics.google.com
2. Admin → Property → Property Access Management
3. Click **+** → Add users
4. Enter email
5. Select role:
   - **Administrator** → Marketing Manager
   - **Editor** → Marketing Manager
   - **Viewer** → Others
6. Click **Add**

---

## 📝 Content Management System (Recommended Future Addition)

### Current Limitation

**Problem**: Content managers need to:
- Learn Git/GitHub
- Understand file structure
- Wait for approvals
- Risk breaking things

### Solution: Add CMS

#### Recommended: **Sanity.io** or **Contentful**

**Benefits**:
- ✅ User-friendly interface
- ✅ No code/Git knowledge needed
- ✅ Real-time preview
- ✅ Role-based permissions built-in
- ✅ Version history
- ✅ Media library
- ✅ Scheduled publishing

#### What Content Managers Can Edit via CMS:

**Safe to edit** (low risk):
- ✅ Webinar links
- ✅ Blog posts/articles
- ✅ Testimonials
- ✅ Team member bios
- ✅ Service descriptions
- ✅ PDF uploads
- ✅ Images

**Not editable** (requires developer):
- ❌ Code files
- ❌ Navigation structure
- ❌ Forms
- ❌ Calculators

#### Quick Setup: Sanity.io

**Install**:
```bash
npm install sanity @sanity/client next-sanity
npx sanity init
```

**Create schemas** for:
- Blog posts
- Testimonials
- Team members
- Resources (PDFs)
- Webinars

**CMS Access Control** (in Sanity):
- Super Admin → Administrator
- Content Manager → Editor
- Marketing Manager → Editor
- Reviewer → Viewer

**Cost**: Free tier available (perfect for your needs)

---

## 👤 Setting Up Team Members

### Step-by-Step Process

#### For Each New Team Member:

**1. Identify Their Role**
- What will they update?
- How often?
- Do they know Git?

**2. Choose Access Level**
- Super Admin → Owner everywhere
- Technical Admin → Admin on GitHub, Editor on Cloud
- Content Manager → Write on GitHub (with protection)
- Marketing Manager → Write on GitHub, GA access
- Reviewer → Read on GitHub

**3. GitHub Setup**
```
1. Go to repo settings
2. Collaborators → Add people
3. Enter email/username
4. Select permission level
5. They get email invitation
6. They accept and gain access
```

**4. Training**
- Super Admin → This guide + technical docs
- Technical Admin → All guides
- Content Manager → SITE-MANAGEMENT-GUIDE.md
- Marketing Manager → Webinar/SEO sections
- Reviewer → Read-only access

**5. Document Access**
Keep a spreadsheet:
```
| Name | Role | GitHub Access | Cloud Access | Email |
|------|------|---------------|--------------|-------|
| You | Owner | Owner | Owner | your@email.com |
| Dev | Technical Admin | Admin | Editor | dev@email.com |
| Marketing | Marketing Mgr | Write | Analytics | marketing@email.com |
```

---

## ✅ Best Practices

### Security

**DO**:
- ✅ Use strong passwords + 2FA for all accounts
- ✅ Review access quarterly
- ✅ Remove access when people leave
- ✅ Use branch protection on main
- ✅ Require pull request reviews
- ✅ Keep audit logs

**DON'T**:
- ❌ Share login credentials
- ❌ Give more access than needed
- ❌ Allow direct pushes to main
- ❌ Skip code reviews
- ❌ Give everyone owner access

### Collaboration

**Pull Request Process**:

1. **Creator** (Content Manager):
   - Creates branch
   - Makes changes
   - Submits PR with description

2. **Reviewer** (Technical Admin):
   - Reviews changes
   - Tests if needed
   - Requests changes or approves

3. **Merger** (Technical Admin):
   - Merges to main
   - Monitors deployment

**PR Template** (create `.github/PULL_REQUEST_TEMPLATE.md`):

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Content update (webinar, PDF, text)
- [ ] Bug fix
- [ ] New feature
- [ ] Configuration change

## Checklist
- [ ] Changes tested locally
- [ ] No broken links
- [ ] Images optimized
- [ ] SEO metadata updated (if applicable)

## Screenshots (if applicable)
Add before/after screenshots
```

### Change Management

**For Major Changes**:
1. Discuss in team meeting
2. Create detailed plan
3. Get stakeholder approval
4. Implement in stages
5. Test thoroughly
6. Deploy during low-traffic time
7. Monitor closely after deployment

**For Minor Changes**:
1. Create PR
2. Get approval
3. Merge and deploy
4. Quick verification

---

## 🔄 Approval Workflows

### Different Workflows by Change Type

#### 1. **Content Update** (Low Risk)

**Who can initiate**: Content Manager
**Approval needed**: 1 Technical Admin
**Timeline**: Same day

**Process**:
```
Content Manager:
1. Create branch
2. Update webinar link / upload PDF
3. Create PR

Technical Admin:
4. Review (5 minutes)
5. Approve and merge
6. Auto-deploys in 10 minutes
```

#### 2. **Code Change** (Medium Risk)

**Who can initiate**: Technical Admin
**Approval needed**: Super Admin
**Timeline**: 1-2 days

**Process**:
```
Technical Admin:
1. Create branch
2. Write code
3. Test locally
4. Create PR with tests

Super Admin:
5. Review code
6. Ask questions if needed
7. Approve or request changes

Technical Admin:
8. Make any requested changes
9. Merge to main
10. Monitor deployment
```

#### 3. **Infrastructure Change** (High Risk)

**Who can initiate**: Technical Admin or Super Admin
**Approval needed**: Super Admin + Business Review
**Timeline**: 1 week

**Process**:
```
1. Create proposal document
2. Business review meeting
3. Technical review
4. Test in staging (if available)
5. Schedule deployment window
6. Implement with rollback plan ready
7. Monitor for 24 hours
```

---

## 📊 Recommended Team Setup for NRI Wealth Partners

### Minimum Team (Starting Out)

```
┌─────────────────────────────────────┐
│         You (Super Admin)           │
│  - Final approvals                  │
│  - Emergency access                 │
└─────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
┌───────▼──────┐  ┌───────▼──────────┐
│ Developer/   │  │ Content Manager  │
│ Tech Admin   │  │ (Staff member)   │
│ (External)   │  │ - Updates        │
│ - Code       │  │ - Webinars       │
│ - Deploy     │  │ - PDFs           │
└──────────────┘  └──────────────────┘
```

### Growing Team (Future)

```
┌─────────────────────────────────────┐
│         You (Super Admin)           │
└─────────────────────────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼────┐  ┌────▼───┐  ┌────▼────────┐
│ Tech   │  │Marketing│  │ Compliance  │
│ Admin  │  │ Manager │  │ Reviewer    │
└───┬────┘  └────┬────┘  └─────────────┘
    │            │
┌───▼────┐  ┌────▼──────────┐
│ Devs   │  │ Content Team  │
└────────┘  └───────────────┘
```

---

## 🚨 Emergency Procedures

### If Someone Leaves the Team

**Immediate Actions**:

1. **Remove GitHub access**:
   ```
   Repo → Settings → Collaborators → Remove
   ```

2. **Remove Google Cloud access**:
   ```
   IAM → Select user → Remove
   ```

3. **Change shared passwords** (if any were shared)

4. **Review recent changes**:
   ```bash
   git log --author="their-email@example.com" --since="1 month ago"
   ```

5. **Revoke any API keys** they had access to

### If Unauthorized Change Detected

1. **Immediately revert**:
   ```bash
   gcloud run services update-traffic nri-wealth-partners \
     --to-revisions=PREVIOUS_GOOD_REVISION=100 \
     --region=us-central1
   ```

2. **Investigate**:
   - Check GitHub audit log
   - Review who made the change
   - Assess damage

3. **Fix**:
   - Revert in Git
   - Re-deploy known good version

4. **Prevent**:
   - Enable branch protection if not already
   - Review access levels
   - Add more approval requirements

---

## 📋 Access Control Checklist

### Initial Setup
- [ ] Enable GitHub 2FA for all team members
- [ ] Set up branch protection on main
- [ ] Create teams/groups for different roles
- [ ] Document who has what access
- [ ] Set up PR approval requirements
- [ ] Configure Google Cloud IAM
- [ ] Set up Google Analytics access

### Monthly Review
- [ ] Review who has access
- [ ] Check for unused accounts
- [ ] Verify access levels are appropriate
- [ ] Review audit logs
- [ ] Update documentation

### When Someone Joins
- [ ] Determine appropriate role
- [ ] Grant minimum necessary access
- [ ] Provide relevant training/guides
- [ ] Add to access documentation
- [ ] Set up their tools (GitHub Desktop, etc.)

### When Someone Leaves
- [ ] Remove GitHub access
- [ ] Remove Google Cloud access
- [ ] Remove Analytics access
- [ ] Change any shared credentials
- [ ] Review their recent changes
- [ ] Update documentation

---

## 🎯 Summary

**Key Takeaways**:

1. ✅ **Different roles need different access**
   - Not everyone needs full access
   - Minimum necessary access = more security

2. ✅ **Use branch protection**
   - Prevents accidental production breaks
   - Ensures code review
   - Creates audit trail

3. ✅ **Separate content from code**
   - Content managers don't need to deploy
   - Consider CMS for easier content management

4. ✅ **Document everything**
   - Who has what access
   - Why they need it
   - When to review

5. ✅ **Regular reviews**
   - Quarterly access audits
   - Remove unused accounts
   - Update as team changes

---

## 📞 Recommended Next Steps

### Immediate (This Week)
1. **Enable branch protection** on main branch
2. **Document current access** (who has what)
3. **Set up 2FA** for all accounts

### Short-term (This Month)
1. **Invite team members** with appropriate roles
2. **Create PR template**
3. **Train content managers** on Git workflow

### Long-term (3-6 Months)
1. **Evaluate CMS solutions** (Sanity, Contentful)
2. **Create staging environment**
3. **Implement automated testing**
4. **Set up detailed audit logging**

---

## 🌐 Web-Based Admin Access

### Current State (No Admin Panel Yet)

**Currently**, your website doesn't have a web-based admin panel. Content changes are made through:
- ✅ GitHub Desktop (desktop app)
- ✅ GitHub.com (web interface)
- ✅ VS Code (code editor)

### Available Web URLs for Current Management

#### 1. **GitHub Web Interface** (Free, Available Now)

**URL**: https://github.com/saurabhraj3-bas/nri-wealth-partners

**What admins can do**:
- ✅ Edit files directly in browser
- ✅ Upload PDFs and images
- ✅ Create and merge pull requests
- ✅ Review code changes
- ✅ View commit history
- ✅ Manage team access

**How to edit content via GitHub.com**:

1. **Go to repository**: https://github.com/saurabhraj3-bas/nri-wealth-partners
2. **Navigate to file**: Click through folders to find file
3. **Click the file** to view it
4. **Click pencil icon** (top right) to edit
5. **Make changes** in the web editor
6. **Commit changes** at bottom:
   - Add commit message
   - Choose "Create a new branch" (for review)
   - Click "Propose changes"
7. **Create pull request** for approval

**Best for**:
- Quick text changes
- Uploading files
- Reviewing changes

**Limitations**:
- Not as user-friendly as a CMS
- Requires understanding file structure
- No preview before deploy

#### 2. **Google Cloud Console**

**URL**: https://console.cloud.google.com/run?project=nri-wealth-partners

**What admins can do**:
- ✅ View deployment status
- ✅ Check logs and errors
- ✅ Monitor performance
- ✅ Manage environment variables
- ✅ Rollback deployments

**Access**:
- Super Admin: Full access
- Technical Admin: Full access
- Others: No access needed

#### 3. **Google Analytics Dashboard**

**URL**: https://analytics.google.com

**What admins can do**:
- ✅ View website traffic
- ✅ See user behavior
- ✅ Track conversions
- ✅ Generate reports

**Access**:
- Super Admin: Administrator
- Marketing Manager: Editor
- Others: Viewer (if needed)

#### 4. **Cloud Build History**

**URL**: https://console.cloud.google.com/cloud-build/builds?project=nri-wealth-partners

**What admins can do**:
- ✅ See deployment history
- ✅ View build logs
- ✅ Check build status
- ✅ Debug deployment issues

---

### Recommended: Add Web-Based CMS (Admin Panel)

For a **better user experience**, I recommend adding a web-based Content Management System (CMS). This gives you a professional admin panel without needing to use GitHub.

#### Option 1: **Sanity Studio** (Recommended)

**What it is**:
- Professional admin panel
- Hosted at `yoursite.com/studio` or `studio.yoursite.com`
- User-friendly interface
- Real-time preview
- Built-in access control

**Cost**: Free for small teams (up to 3 admins)

**Demo**: https://www.sanity.io/demos

**Admin Panel Features**:
- 📝 Rich text editor for content
- 🖼️ Drag-and-drop image uploads
- 📄 PDF management
- 👥 Team member management
- ⭐ Testimonials management
- 🔗 Webinar link updates
- 📊 Version history
- 👁️ Live preview

**Sample Admin URLs** (after setup):
```
Admin Panel: https://nriwealthpartners.com/studio
OR
Admin Panel: https://studio.nriwealthpartners.com

Login: email + password
```

**Access Control in Sanity**:
- Super Admin → Administrator role
- Content Manager → Editor role
- Marketing Manager → Editor role
- Reviewer → Viewer role

**What content managers see**:
- Simple forms to update content
- Upload PDFs by dragging files
- Change webinar links in text box
- Update team bios in rich text editor
- No code, no Git, no technical knowledge needed

#### Option 2: **Contentful** (Alternative)

**Similar to Sanity**, different pricing:
- Admin panel: https://app.contentful.com
- Free tier available
- Visual content editor
- Media library

#### Option 3: **Custom Admin Panel** (Build Your Own)

**What it is**:
- Custom-built admin panel in Next.js
- Complete control over features
- Integrated with your website

**URL**: `https://nriwealthpartners.com/admin`

**Cost**: Development time (20-40 hours)

**Features you could add**:
- Login with email/password
- Dashboard showing recent changes
- Forms to edit content
- File upload interface
- User management
- Activity logs

**Tech stack**:
```
- Next.js Auth (authentication)
- Prisma + Database (store content)
- React Hook Form (admin forms)
- File upload component
```

---

### Quick Setup: Sanity CMS (Recommended)

#### Step 1: Install Sanity

```bash
npm install sanity @sanity/client next-sanity
npm install @sanity/vision  # Admin panel
```

#### Step 2: Initialize Sanity

```bash
npx sanity init

# Answer prompts:
Project name: NRI Wealth Partners
Use default dataset: Yes
Project output path: ./studio
```

#### Step 3: Create Content Schemas

**File**: `studio/schemas/webinar.ts`

```typescript
export default {
  name: 'webinar',
  title: 'Webinars',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Webinar Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'registrationLink',
      title: 'Registration Link',
      type: 'url',
      validation: Rule => Rule.required()
    },
    {
      name: 'date',
      title: 'Webinar Date',
      type: 'datetime'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    }
  ]
}
```

**File**: `studio/schemas/resource.ts`

```typescript
export default {
  name: 'resource',
  title: 'Resources (PDFs)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Resource Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Tax Planning', value: 'tax'},
          {title: 'Investment', value: 'investment'},
          {title: 'Retirement', value: 'retirement'}
        ]
      }
    },
    {
      name: 'file',
      title: 'PDF File',
      type: 'file',
      options: {
        accept: '.pdf'
      }
    }
  ]
}
```

#### Step 4: Deploy Sanity Studio

```bash
cd studio
npm run build
npx sanity deploy

# Choose a studio hostname:
# nri-wealth-partners.sanity.studio
```

#### Step 5: Access Your Admin Panel

**URL**: https://nri-wealth-partners.sanity.studio

**Login with**: Your Sanity account (created during setup)

#### Step 6: Add Team Members

1. Go to: https://www.sanity.io/manage
2. Select your project
3. Go to **Settings** → **Members**
4. Click **Invite member**
5. Enter email and select role:
   - **Administrator** → Super Admin
   - **Editor** → Content/Marketing Manager
   - **Viewer** → Reviewer

#### Step 7: Connect CMS to Website

**File**: `lib/sanity.ts`

```typescript
import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'your-project-id',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
})

// Fetch webinars
export async function getWebinars() {
  return client.fetch(`*[_type == "webinar"] | order(date desc)`)
}

// Fetch resources
export async function getResources() {
  return client.fetch(`*[_type == "resource"] | order(_createdAt desc)`)
}
```

**Use in pages**: `app/services/page.tsx`

```typescript
import { getWebinars } from '@/lib/sanity'

export default async function ServicesPage() {
  const webinars = await getWebinars()
  const currentWebinar = webinars[0]

  return (
    <Link href={currentWebinar.registrationLink}>
      Register for {currentWebinar.title}
    </Link>
  )
}
```

---

### Comparison: GitHub vs CMS

| Feature | GitHub Web | Sanity CMS | Custom Admin |
|---------|-----------|------------|--------------|
| **Ease of Use** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Cost** | Free | Free tier | Development time |
| **User-Friendly** | Technical | Very easy | Customizable |
| **Preview** | No | Yes | Can add |
| **Access Control** | Good | Excellent | Full control |
| **Setup Time** | 0 | 2-4 hours | 20-40 hours |
| **Best For** | Tech users | Content teams | Specific needs |

---

### My Recommendation

**Start with**: GitHub Web (what you have now)
- ✅ Free
- ✅ Already set up
- ✅ Works for small team

**Upgrade to**: Sanity CMS when:
- You have non-technical content managers
- You update content frequently (weekly)
- You have 3+ people managing content
- You want better user experience

**Build Custom Admin** only if:
- You have specific requirements
- Budget for development
- Need custom workflows

---

### Admin Access Summary

**Current Web URLs** (Available Now):

```
Repository Management:
→ https://github.com/saurabhraj3-bas/nri-wealth-partners

Cloud Infrastructure:
→ https://console.cloud.google.com/run?project=nri-wealth-partners

Deployment History:
→ https://console.cloud.google.com/cloud-build/builds?project=nri-wealth-partners

Analytics:
→ https://analytics.google.com

Domain/DNS:
→ Your domain registrar's control panel
```

**Future Admin Panel** (After CMS Setup):

```
Content Management:
→ https://nri-wealth-partners.sanity.studio
  (or custom domain like admin.nriwealthpartners.com)

Login required for:
- Update webinars
- Upload PDFs
- Manage testimonials
- Edit team bios
- Change content
```

---

## 📊 Recommended Access Setup

### Immediate Setup (This Week)

**Web Access Given**:

| Person | GitHub.com | Cloud Console | Analytics |
|--------|-----------|---------------|-----------|
| You (Super Admin) | ✅ Owner | ✅ Owner | ✅ Admin |
| Developer | ✅ Admin | ✅ Editor | ✅ Viewer |
| Content Manager | ✅ Write | ❌ None | ❌ None |
| Marketing | ✅ Write | ❌ None | ✅ Editor |

### After CMS Setup (1-2 Months)

**Web Access Given**:

| Person | GitHub.com | Cloud Console | Analytics | **CMS Admin** |
|--------|-----------|---------------|-----------|--------------|
| You | ✅ Owner | ✅ Owner | ✅ Admin | ✅ **Administrator** |
| Developer | ✅ Admin | ✅ Editor | ✅ Viewer | ✅ **Administrator** |
| Content Manager | ❌ None* | ❌ None | ❌ None | ✅ **Editor** |
| Marketing | ❌ None* | ❌ None | ✅ Editor | ✅ **Editor** |

*With CMS, they won't need GitHub access anymore!

---

**Questions?** Refer to:
- GitHub Permissions: https://docs.github.com/en/organizations/managing-access-to-your-organizations-repositories/repository-permission-levels-for-an-organization
- Google Cloud IAM: https://cloud.google.com/iam/docs/overview

---

**Last Updated**: November 2024
**Version**: 1.0
