# Quick Start - Deployment Setup

This guide will help you configure the automated deployment workflow for the ADEI website.

## 📋 Prerequisites

Before you can use the automated deployment, you need:
1. Access to your GitHub repository settings
2. Your FTP credentials from your hosting provider (Genious)
3. The backend API URL (or a placeholder if not ready yet)

## 🔑 Step 1: Configure GitHub Secrets

You need to add 6 secrets to your GitHub repository. Follow these steps:

1. **Go to your repository on GitHub**: https://github.com/moslimar/ADEI-Website

2. **Navigate to Settings**:
   - Click on the "Settings" tab at the top of the repository
   - In the left sidebar, click "Secrets and variables"
   - Click "Actions"

3. **Add each of the following secrets** by clicking "New repository secret":

### Required Secrets

| Secret Name | Value to Use |
|------------|--------------|
| `FTP_HOST` | `adei-ensaf.ma` |
| `FTP_PORT` | `21` |
| `FTP_USERNAME` | `adeisite_adei-ensaf.ma` |
| `FTP_PASSWORD` | Your FTP password from Genious |
| `FTP_REMOTE_DIR` | `/home/adeiensa/public_html/adei/` |
| `REACT_APP_API_URL` | Your backend API URL (or `https://api.adei-ensaf.ma` as placeholder) |

**Important Notes:**
- Keep `FTP_PASSWORD` secure and never commit it to the repository
- `FTP_REMOTE_DIR` must end with a trailing slash `/`
- If you don't have a backend API yet, you can use a placeholder like `https://api.adei-ensaf.ma` or `http://localhost:5001` temporarily

## 🚀 Step 2: Trigger Your First Deployment

Once the secrets are configured, the deployment will happen automatically when you push to the `main` branch.

### Option A: Merge this PR
1. Merge this pull request to the `main` branch
2. The workflow will automatically trigger
3. Go to the "Actions" tab to monitor the deployment

### Option B: Manual Trigger
1. Go to the "Actions" tab in your repository
2. Click on "Deploy to FTP" workflow
3. Click "Run workflow"
4. Select the `main` branch
5. Click "Run workflow"

## 📊 Step 3: Monitor the Deployment

1. **Go to Actions tab**: Click on "Actions" at the top of your repository
2. **Select the workflow run**: Click on the most recent "Deploy to FTP" run
3. **View progress**: Watch each step complete
   - ✅ Checkout code
   - ✅ Setup Node.js
   - ✅ Install dependencies
   - ✅ Build React app
   - ✅ Create .htaccess
   - ✅ Deploy to FTP

4. **Check for errors**: If any step fails, click on it to see the error details

## ✅ Step 4: Verify Deployment

After successful deployment:
1. Visit your website: `https://adei-ensaf.ma/adei/`
2. Test navigation between pages
3. Refresh a page to verify `.htaccess` routing works
4. Check browser console for any API errors

## 🔧 Troubleshooting

### Build Fails
- **Check**: All dependencies are in `package.json`
- **Check**: `REACT_APP_API_URL` secret is set

### FTP Connection Fails
- **Check**: `FTP_HOST` is correct (no http:// or https://)
- **Check**: `FTP_PORT` is `21`
- **Check**: `FTP_USERNAME` and `FTP_PASSWORD` are correct
- **Check**: Your hosting provider allows FTPS connections

### Deployment Succeeds but Site Not Working
- **Check**: Website URL is `https://adei-ensaf.ma/adei/` (with `/adei/`)
- **Check**: `.htaccess` file exists in deployment directory
- **Check**: Apache `mod_rewrite` is enabled on server
- **Check**: Browser console for API errors

### 404 on Page Refresh
- **Check**: `.htaccess` file is present on server
- **Check**: `RewriteBase` in `.htaccess` matches deployment directory (`/adei/`)
- **Check**: Apache `mod_rewrite` module is enabled

## 📚 Need More Help?

For detailed documentation, see:
- [docs/deployment.md](docs/deployment.md) - Complete deployment guide
- [README.md](README.md) - Project overview and setup

## 🎯 Summary

1. ✅ Add 6 secrets to GitHub repository settings
2. ✅ Push to `main` branch or manually trigger workflow
3. ✅ Monitor deployment in Actions tab
4. ✅ Verify website works at `https://adei-ensaf.ma/adei/`

That's it! Your deployment workflow is ready to use. 🎉
