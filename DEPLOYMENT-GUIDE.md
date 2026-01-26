# Deployment Guide - Fix 404 Refresh Issue

## Problem
When users refresh a page like `/news` or `/events`, they get a 404 error instead of the React page.

## Solutions (Try in order)

### Solution 1: Upload ALL files to your hosting
Make sure you upload ALL these files to your web hosting:

1. **Upload the entire `build` folder contents** to your website root
2. **Upload `.htaccess`** to the same directory as `index.html`
3. **Upload `web.config`** (for Windows/IIS servers)
4. **Upload `_redirects`** (for Netlify/Vercel)

### Solution 2: Check if mod_rewrite is enabled
Contact your hosting provider and ask them to enable `mod_rewrite` for Apache.

### Solution 3: Alternative .htaccess (if the current one doesn't work)
Replace your `.htaccess` with this simpler version:

```apache
Options +FollowSymLinks
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Solution 4: For cPanel hosting
If you're using cPanel, try this .htaccess:

```apache
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
</IfModule>
```

### Solution 5: For Shared Hosting
Some shared hosting providers require this format:

```apache
RewriteEngine on
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^(.*)$ index.html [L]
```

### Solution 6: PHP Fallback
If .htaccess doesn't work, rename `index.html` to `index.php` and add this at the top:

```php
<?php
$request = $_SERVER['REQUEST_URI'];
if (strpos($request, '.') === false && $request !== '/') {
    include 'index.html';
    exit;
}
?>
```

### Solution 7: Contact Your Hosting Provider
If none of the above work, contact your hosting provider and ask them:

1. "Do you support URL rewriting?"
2. "How do I configure Single Page Application (SPA) routing?"
3. "Can you enable mod_rewrite for my account?"

### Testing
After implementing any solution:

1. Visit your website normally: `https://adei-ensaf.ma`
2. Navigate to a page like News: `https://adei-ensaf.ma/news`
3. Refresh the page (F5 or Ctrl+R)
4. The page should load correctly, not show 404

### Files Created for You:
- `.htaccess` - Apache server configuration
- `web.config` - IIS server configuration  
- `_redirects` - Netlify/Vercel configuration
- `index.php` - PHP fallback solution
- `server.js` - Node.js server solution

Choose the appropriate file based on your hosting provider's requirements.