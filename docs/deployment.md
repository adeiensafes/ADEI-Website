# Deployment Guide - ADEI Website

This document explains how to deploy the ADEI website to production using GitHub Actions and FTP.

## Overview

The ADEI website uses an automated deployment workflow that:
1. Builds the React frontend application
2. Creates necessary configuration files for production
3. Deploys the built files to your hosting server via FTPS

## Prerequisites

- A GitHub repository for the ADEI website
- A hosting account with FTPS access (port 21, explicit TLS)
- Access to GitHub repository settings to configure secrets

## Required GitHub Secrets

The deployment workflow requires the following secrets to be configured in your GitHub repository. To add secrets, go to your repository on GitHub, then navigate to **Settings → Secrets and variables → Actions → New repository secret**.

### FTP Credentials

| Secret Name | Description | Example |
|------------|-------------|---------|
| `FTP_HOST` | Your FTP server hostname | `adei-ensaf.ma` |
| `FTP_PORT` | FTP server port (usually 21) | `21` |
| `FTP_USERNAME` | FTP username for deployment | `adeisite_adei-ensaf.ma` |
| `FTP_PASSWORD` | FTP password | `your-secure-password` |
| `FTP_REMOTE_DIR` | Target directory on server | `/home/adeiensa/public_html/adei/` |

### Application Configuration

| Secret Name | Description | Example |
|------------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `https://api.adei-ensaf.ma` or placeholder |

**Important Notes:**
- Never commit these secrets to your repository
- Use strong, unique passwords for FTP access
- The `FTP_REMOTE_DIR` should end with a trailing slash
- The remote directory must exist on your server before first deployment

## Setting Up GitHub Secrets

### Step-by-Step Guide

1. **Navigate to Repository Settings**
   - Go to your GitHub repository
   - Click on "Settings" in the top menu
   - In the left sidebar, click "Secrets and variables" → "Actions"

2. **Add Each Secret**
   - Click "New repository secret"
   - Enter the secret name (e.g., `FTP_HOST`)
   - Enter the secret value
   - Click "Add secret"
   - Repeat for all required secrets

3. **Verify Secrets**
   - Ensure all secrets are listed under "Repository secrets"
   - Secret values are hidden for security

## Deployment Workflow

### Automatic Deployment

The deployment workflow is triggered automatically on every push to the `main` branch.

**Workflow steps:**
1. Checkout the repository code
2. Set up Node.js environment (v20 LTS)
3. Install frontend dependencies
4. Build the React application with environment variables
5. Create `.htaccess` file for SPA routing support
6. Deploy built files to FTP server via FTPS

### Manual Deployment

To manually trigger a deployment:
1. Go to the "Actions" tab in your GitHub repository
2. Select the "Deploy to FTP" workflow
3. Click "Run workflow"
4. Select the `main` branch
5. Click "Run workflow"

## Deployment Configuration

### Workflow File

The deployment workflow is defined in `.github/workflows/deploy-ftp.yml`

Key configuration details:
- **Node.js version**: 20 (LTS)
- **Protocol**: FTPS (explicit TLS)
- **Action used**: `SamKirkland/FTP-Deploy-Action@v4.3.5`
- **Source directory**: `./frontend/build/`
- **Clean deployment**: No (preserves existing files outside deployment scope)

### .htaccess Configuration

The workflow automatically creates a `.htaccess` file in the build output with:
- **URL rewriting** for React Router (client-side routing)
- **Security headers** (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- **Directory browsing** disabled
- **Cache control** for static assets (images, CSS, JS)

The `.htaccess` is configured for deployment to the `/adei/` subdirectory.

## Frontend Configuration

### API URL Configuration

The frontend uses environment variables to configure the backend API URL:

```javascript
// frontend/src/config/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
```

- **Development**: Uses `http://localhost:5001` (default fallback)
- **Production**: Uses `REACT_APP_API_URL` from GitHub secrets

### Environment Variable Usage

During build, the `REACT_APP_API_URL` secret is:
1. Passed as an environment variable to the build process
2. Embedded in the production build
3. Used by the frontend to make API calls

## Monitoring Deployments

### Viewing Deployment Status

1. Go to the "Actions" tab in your GitHub repository
2. Click on the most recent workflow run
3. View the status and logs of each step

### Deployment Success Indicators

✅ All workflow steps completed successfully
✅ Build completed without errors
✅ Files uploaded to FTP server
✅ Website accessible at `https://adei-ensaf.ma/adei/`

### Common Deployment Issues

#### Build Failures

**Problem**: Build fails with dependency errors
- **Solution**: Check `package-lock.json` is committed and up to date
- **Solution**: Verify all dependencies in `package.json` are valid

**Problem**: Build fails with environment variable errors
- **Solution**: Verify `REACT_APP_API_URL` secret is configured

#### FTP Connection Issues

**Problem**: FTP connection refused or timeout
- **Solution**: Verify `FTP_HOST` and `FTP_PORT` are correct
- **Solution**: Ensure firewall allows FTPS connections (port 21)
- **Solution**: Contact hosting provider to verify FTPS is enabled

**Problem**: Authentication failed
- **Solution**: Verify `FTP_USERNAME` and `FTP_PASSWORD` are correct
- **Solution**: Check with hosting provider if account is active

**Problem**: Permission denied on upload
- **Solution**: Verify `FTP_REMOTE_DIR` exists on server
- **Solution**: Ensure FTP user has write permissions to target directory
- **Solution**: Contact hosting provider to verify directory permissions

#### Website Issues After Deployment

**Problem**: 404 errors on page refresh
- **Solution**: Verify `.htaccess` file is present in deployment directory
- **Solution**: Ensure Apache `mod_rewrite` is enabled on server
- **Solution**: Check `.htaccess` RewriteBase matches deployment subdirectory

**Problem**: API calls failing
- **Solution**: Verify `REACT_APP_API_URL` is correctly configured
- **Solution**: Check browser console for CORS errors
- **Solution**: Ensure backend API is accessible from production

**Problem**: Static assets not loading
- **Solution**: Verify assets were uploaded to FTP server
- **Solution**: Check file paths in browser console
- **Solution**: Ensure assets are in correct subdirectory (`/adei/`)

## Server Configuration

### Directory Structure

Your hosting server should have the following structure:

```
/home/adeiensa/
└── public_html/
    ├── adei/                    # ADEI website deployment target
    │   ├── index.html
    │   ├── .htaccess
    │   ├── static/
    │   │   ├── css/
    │   │   ├── js/
    │   │   └── media/
    │   └── ...
    └── [other sites/folders]    # Not affected by deployment
```

### Apache Configuration Requirements

The deployment assumes Apache with:
- `mod_rewrite` enabled (for SPA routing)
- `mod_headers` enabled (for security headers)
- `mod_expires` enabled (for cache control)
- `.htaccess` support enabled (`AllowOverride All`)

### Testing Server Configuration

After deployment, test the following:
1. **Home page loads**: `https://adei-ensaf.ma/adei/`
2. **Direct route access**: `https://adei-ensaf.ma/adei/about` (should not 404)
3. **Page refresh works**: Refresh any page without 404 errors
4. **API calls work**: Check browser console for successful API requests
5. **Static assets load**: Images, CSS, and JS files load correctly

## Security Considerations

### Secrets Management
- Never commit secrets to the repository
- Rotate FTP passwords regularly
- Use strong, unique passwords
- Limit FTP user permissions to necessary directories only

### HTTPS
- Ensure your domain has a valid SSL certificate
- Configure your server to redirect HTTP to HTTPS
- Update API URLs to use HTTPS

### File Permissions
- Ensure deployment directory has appropriate permissions (typically 755 for directories, 644 for files)
- `.htaccess` should be readable (644)
- Prevent directory listing with `.htaccess` or server configuration

## Rollback Procedure

If a deployment causes issues:

1. **Immediate Action**
   - The workflow preserves previous files (doesn't clean slate)
   - Contact hosting provider to restore from backup if needed

2. **Fix and Redeploy**
   - Revert changes in Git: `git revert <commit-hash>`
   - Push to main branch to trigger redeployment
   - Monitor deployment in GitHub Actions

3. **Manual Rollback**
   - Access server via FTP manually
   - Replace files with previous version from backup
   - Test website functionality

## Maintenance

### Updating Dependencies
1. Update `package.json` with new versions
2. Test locally: `npm install && npm run build`
3. Commit and push changes
4. Monitor deployment in GitHub Actions

### Updating Workflow
1. Edit `.github/workflows/deploy-ftp.yml`
2. Test changes in a feature branch first
3. Merge to main when verified

### Monitoring
- Check GitHub Actions regularly for failed deployments
- Set up notifications for workflow failures (GitHub repository settings)
- Monitor server logs for errors
- Test website functionality after each deployment

## Support and Troubleshooting

### Getting Help

1. **Check workflow logs** in GitHub Actions tab
2. **Review error messages** carefully
3. **Verify all secrets** are configured correctly
4. **Test locally** before deploying
5. **Contact hosting provider** for server-side issues

### Useful Commands for Local Testing

```bash
# Install dependencies
cd frontend
npm install

# Build locally with environment variable
REACT_APP_API_URL=https://api.adei-ensaf.ma npm run build

# Test build output
cd build
ls -la  # Verify files are present

# Start local server to test build
npx serve -s build
```

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Create React App Deployment](https://create-react-app.dev/docs/deployment/)
- [SamKirkland/FTP-Deploy-Action](https://github.com/SamKirkland/FTP-Deploy-Action)
- [Apache mod_rewrite Documentation](https://httpd.apache.org/docs/current/mod/mod_rewrite.html)

---

**Last Updated**: January 2026
**Maintained by**: ADEI Development Team
