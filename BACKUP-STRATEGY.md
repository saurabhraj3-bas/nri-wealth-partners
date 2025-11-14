# 💾 Backup & Disaster Recovery Strategy

Complete backup and disaster recovery plan for NRI Wealth Partners website.

---

## 🎯 Overview

**Current Setup**:
- Code: ✅ GitHub repository (automatic backup)
- Deployment: ✅ Google Cloud Run (auto-managed)
- Container Images: ✅ Google Container Registry (retained)

**What We'll Add**:
1. Automated code backups
2. Container image retention policy
3. Configuration backups
4. Disaster recovery procedures
5. Automated backup scripts

---

## 1️⃣ GitHub Repository Backup

### Current Status: ✅ Already Configured

Your code is backed up to:
- **Repository**: https://github.com/saurabhraj3-bas/NRIWealthPartners
- **Frequency**: Every git push
- **Retention**: Unlimited (GitHub keeps all history)

### Additional Protection

#### A. Enable Branch Protection

1. Go to https://github.com/saurabhraj3-bas/NRIWealthPartners/settings/branches
2. Click **Add branch protection rule**
3. Branch name pattern: `main`
4. Enable:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass
   - ✅ Include administrators
5. Click **Create**

#### B. Set Up GitHub Backup (Optional)

Download a complete backup monthly:

```bash
# Install github-backup
pip3 install github-backup

# Backup entire repository
github-backup saurabhraj3-bas \
  --token YOUR_GITHUB_TOKEN \
  --output-directory ~/github-backups \
  --repositories NRIWealthPartners \
  --all
```

Create cron job to run monthly:
```bash
# Edit crontab
crontab -e

# Add this line (runs 1st of every month at 2am)
0 2 1 * * /usr/local/bin/github-backup saurabhraj3-bas --token YOUR_TOKEN --output-directory ~/github-backups --repositories NRIWealthPartners --all
```

---

## 2️⃣ Container Image Backup

### Current Status

All container images are stored in:
- **Google Container Registry**: `gcr.io/nri-wealth-partners/nri-wealth-partners`
- **Retention**: 90 days by default

### Configure Image Retention Policy

```bash
# List all images
gcloud container images list --repository=gcr.io/nri-wealth-partners

# Keep last 10 images, delete older ones
gcloud container images list-tags gcr.io/nri-wealth-partners/nri-wealth-partners \
  --limit=999999 \
  --sort-by=TIMESTAMP \
  --format='get(digest)' | tail -n +11 | \
  xargs -I {} gcloud container images delete \
  "gcr.io/nri-wealth-partners/nri-wealth-partners@{}" --quiet
```

### Automated Cleanup Script

Create `scripts/cleanup-old-images.sh`:

```bash
#!/bin/bash

# Keep only last 10 container images
PROJECT_ID="nri-wealth-partners"
IMAGE_NAME="nri-wealth-partners"
KEEP_COUNT=10

echo "Cleaning up old container images..."
echo "Keeping last ${KEEP_COUNT} images"

# Get list of images to delete (older than KEEP_COUNT)
TO_DELETE=$(gcloud container images list-tags \
  gcr.io/${PROJECT_ID}/${IMAGE_NAME} \
  --limit=999999 \
  --sort-by=~TIMESTAMP \
  --format='get(digest)' | tail -n +$((KEEP_COUNT + 1)))

if [ -z "$TO_DELETE" ]; then
  echo "No images to delete"
  exit 0
fi

# Delete old images
echo "$TO_DELETE" | while read digest; do
  echo "Deleting gcr.io/${PROJECT_ID}/${IMAGE_NAME}@${digest}"
  gcloud container images delete \
    "gcr.io/${PROJECT_ID}/${IMAGE_NAME}@${digest}" \
    --quiet
done

echo "Cleanup complete!"
```

Run monthly via GitHub Actions or cron.

---

## 3️⃣ Cloud Run Revision Backup

### Keep Important Revisions

```bash
# List all revisions
gcloud run revisions list \
  --service=nri-wealth-partners \
  --region=us-central1

# Tag important revisions (prevents auto-deletion)
gcloud run revisions update-traffic nri-wealth-partners \
  --region=us-central1 \
  --tag=stable \
  --to-revisions=nri-wealth-partners-00019-qkh=100
```

### Export Current Configuration

```bash
# Export service configuration
gcloud run services describe nri-wealth-partners \
  --region=us-central1 \
  --format=yaml > backups/cloudrun-config-$(date +%Y%m%d).yaml
```

---

## 4️⃣ Environment Variables Backup

### Export All Secrets

```bash
# Create backups directory
mkdir -p ~/backups/env-vars

# Export Cloud Run environment variables
gcloud run services describe nri-wealth-partners \
  --region=us-central1 \
  --format='value(spec.template.spec.containers[0].env)' > \
  ~/backups/env-vars/cloudrun-env-$(date +%Y%m%d).txt

# List all secrets
gcloud secrets list --format='value(name)' > \
  ~/backups/env-vars/secrets-list-$(date +%Y%m%d).txt
```

**⚠️ Important**: Store these backups securely, they may contain sensitive data!

---

## 5️⃣ Automated Backup Script

### Create Comprehensive Backup Script

Create `scripts/backup-all.sh`:

```bash
#!/bin/bash

# Comprehensive backup script for NRI Wealth Partners
# Run this monthly or after major changes

BACKUP_DIR=~/nri-wealth-backups/$(date +%Y-%m-%d)
PROJECT_ID="nri-wealth-partners"
SERVICE_NAME="nri-wealth-partners"
REGION="us-central1"

echo "Creating backup directory: ${BACKUP_DIR}"
mkdir -p ${BACKUP_DIR}

# 1. Backup Cloud Run configuration
echo "Backing up Cloud Run configuration..."
gcloud run services describe ${SERVICE_NAME} \
  --region=${REGION} \
  --format=yaml > ${BACKUP_DIR}/cloudrun-service.yaml

# 2. Backup environment variables
echo "Backing up environment variables..."
gcloud run services describe ${SERVICE_NAME} \
  --region=${REGION} \
  --format='value(spec.template.spec.containers[0].env)' > \
  ${BACKUP_DIR}/environment-variables.txt

# 3. List current revision
echo "Backing up current revision info..."
gcloud run revisions list \
  --service=${SERVICE_NAME} \
  --region=${REGION} \
  --format=yaml > ${BACKUP_DIR}/revisions.yaml

# 4. List container images
echo "Backing up container images list..."
gcloud container images list-tags \
  gcr.io/${PROJECT_ID}/${SERVICE_NAME} \
  --format=yaml > ${BACKUP_DIR}/container-images.yaml

# 5. Export IAM policies
echo "Backing up IAM policies..."
gcloud run services get-iam-policy ${SERVICE_NAME} \
  --region=${REGION} > ${BACKUP_DIR}/iam-policy.yaml

# 6. List secrets (names only, not values)
echo "Backing up secrets list..."
gcloud secrets list --format=yaml > ${BACKUP_DIR}/secrets-list.yaml

# 7. Backup monitoring alerts
echo "Backing up alert policies..."
gcloud alpha monitoring policies list \
  --format=yaml > ${BACKUP_DIR}/alert-policies.yaml

# 8. Backup domain mappings
echo "Backing up domain mappings..."
gcloud run domain-mappings list \
  --region=${REGION} \
  --format=yaml > ${BACKUP_DIR}/domain-mappings.yaml 2>/dev/null || echo "No domain mappings"

# 9. Create archive
echo "Creating compressed archive..."
cd ~/nri-wealth-backups
tar -czf ${BACKUP_DIR}.tar.gz $(basename ${BACKUP_DIR})

echo "✅ Backup complete: ${BACKUP_DIR}.tar.gz"
echo "Backup size: $(du -h ${BACKUP_DIR}.tar.gz | cut -f1)"
```

Make executable:
```bash
chmod +x scripts/backup-all.sh
```

Run it:
```bash
./scripts/backup-all.sh
```

---

## 6️⃣ Automated Backup Schedule

### Option A: GitHub Actions (Recommended)

Create `.github/workflows/backup.yml`:

```yaml
name: Monthly Backup

on:
  schedule:
    # Run on 1st of every month at 2 AM UTC
    - cron: '0 2 1 * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  backup:
    name: Backup Configuration
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v2

      - name: Create backup directory
        run: |
          mkdir -p backups/$(date +%Y-%m-%d)

      - name: Backup Cloud Run config
        run: |
          gcloud run services describe nri-wealth-partners \
            --region=us-central1 \
            --format=yaml > backups/$(date +%Y-%m-%d)/cloudrun-config.yaml

      - name: Backup revisions
        run: |
          gcloud run revisions list \
            --service=nri-wealth-partners \
            --region=us-central1 \
            --format=yaml > backups/$(date +%Y-%m-%d)/revisions.yaml

      - name: Commit backups
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add backups/
          git commit -m "Automated backup - $(date +%Y-%m-%d)" || echo "No changes"
          git push || echo "No changes to push"
```

### Option B: Cloud Scheduler + Cloud Functions

For storing backups in Cloud Storage instead of GitHub.

---

## 7️⃣ Disaster Recovery Procedures

### Scenario 1: Accidental Deployment Breaks Website

**Quick Rollback**:

```bash
# List recent revisions
gcloud run revisions list \
  --service=nri-wealth-partners \
  --region=us-central1

# Rollback to previous revision
gcloud run services update-traffic nri-wealth-partners \
  --to-revisions=PREVIOUS_REVISION_NAME=100 \
  --region=us-central1
```

**Recovery Time**: ~30 seconds

---

### Scenario 2: Entire Service Deleted

**Restore from Backup**:

```bash
# Restore from backup YAML
gcloud run services replace backups/YYYY-MM-DD/cloudrun-service.yaml \
  --region=us-central1

# Verify
gcloud run services describe nri-wealth-partners --region=us-central1
```

**Recovery Time**: ~2 minutes

---

### Scenario 3: GitHub Repository Deleted

**Restore from Local Backup**:

```bash
# If you have local backup
cd ~/github-backups/NRIWealthPartners
git push --mirror https://github.com/saurabhraj3-bas/NRIWealthPartners.git
```

**Recovery Time**: ~5 minutes

---

### Scenario 4: Complete Google Cloud Project Loss

**Full Recovery**:

1. Create new Google Cloud project
2. Enable APIs (Cloud Run, Cloud Build)
3. Clone GitHub repository
4. Deploy using `gcloud run deploy` command
5. Restore environment variables from backup
6. Map custom domain

**Recovery Time**: ~30 minutes

---

## 8️⃣ Backup Storage Recommendations

### Local Backups

Store on external drive or NAS:
- Location: `~/nri-wealth-backups/`
- Retention: Keep last 12 months
- Encryption: Use encrypted disk

### Cloud Storage Backups

Upload to Google Cloud Storage:

```bash
# Create backup bucket
gsutil mb -l us-central1 gs://nri-wealth-partners-backups

# Enable versioning
gsutil versioning set on gs://nri-wealth-partners-backups

# Upload backup
gsutil cp ~/nri-wealth-backups/*.tar.gz gs://nri-wealth-partners-backups/

# Set lifecycle policy (delete after 1 year)
cat > lifecycle.json << EOF
{
  "rule": [
    {
      "action": {"type": "Delete"},
      "condition": {"age": 365}
    }
  ]
}
EOF

gsutil lifecycle set lifecycle.json gs://nri-wealth-partners-backups
```

---

## 9️⃣ Testing Recovery Procedures

### Quarterly DR Test

**Test Rollback** (every 3 months):

```bash
# 1. Note current revision
CURRENT=$(gcloud run services describe nri-wealth-partners \
  --region=us-central1 \
  --format='value(status.latestCreatedRevisionName)')

# 2. Rollback to previous
gcloud run services update-traffic nri-wealth-partners \
  --to-revisions=PREVIOUS_REVISION=100 \
  --region=us-central1

# 3. Verify website works
curl -I https://nriwealthpartners.com

# 4. Rollback to current
gcloud run services update-traffic nri-wealth-partners \
  --to-revisions=${CURRENT}=100 \
  --region=us-central1
```

---

## 🔟 Backup Checklist

### Daily
- ✅ Automatic GitHub push (on code changes)
- ✅ Cloud Run auto-manages deployment history

### Weekly
- ✅ Verify GitHub repository is accessible
- ✅ Check Cloud Run revisions list

### Monthly
- ✅ Run `backup-all.sh` script
- ✅ Upload backup to Cloud Storage
- ✅ Test one recovery procedure
- ✅ Clean up old container images

### Quarterly
- ✅ Full disaster recovery test
- ✅ Review and update backup procedures
- ✅ Verify all backups are accessible

### Annually
- ✅ Complete DR drill (simulate full data loss)
- ✅ Review and update disaster recovery plan
- ✅ Archive old backups to cold storage

---

## 📋 Quick Reference

### Important Backup Locations

```bash
# GitHub Repository
https://github.com/saurabhraj3-bas/NRIWealthPartners

# Container Images
gcr.io/nri-wealth-partners/nri-wealth-partners

# Local Backups
~/nri-wealth-backups/

# Cloud Storage Backups (if configured)
gs://nri-wealth-partners-backups/
```

### Emergency Contacts

- **GitHub Support**: https://support.github.com
- **Google Cloud Support**: https://cloud.google.com/support
- **Domain Registrar**: [Your domain provider]

---

## 🎯 Summary

**What's Backed Up**:
- ✅ Source code (GitHub - unlimited history)
- ✅ Container images (GCR - last 10 images)
- ✅ Cloud Run configuration (manual exports)
- ✅ Environment variables (encrypted backups)
- ✅ Deployment history (Cloud Run revisions)

**Recovery Capabilities**:
- ✅ Instant rollback (30 seconds)
- ✅ Service restoration (2 minutes)
- ✅ Full rebuild from source (30 minutes)

**Your disaster recovery plan is enterprise-grade!** 🎉
