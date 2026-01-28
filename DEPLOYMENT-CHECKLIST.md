# Deployment Checklist for ADEI API

## Files to Upload to Production Server

### Required Server Files:
- ✅ `server/index.js` (main server file)
- ✅ `server/package.json` (dependencies)
- ✅ `server/package-lock.json` (exact versions)
- ✅ `server/.env` (environment variables)
- ✅ `server/config/database.js` (database configuration)
- ✅ `server/middleware/auth.js` (authentication middleware)
- ✅ `server/models/` (all model files)
- ✅ `server/routes/` (all route files)
- ✅ `server/api-interface.js` (API web interface)
- ✅ `server/uploads/` (upload directory - create if missing)

### Optional Files:
- `server/utils/` (utility functions)
- `server/migrations/` (database migrations)

## Deployment Steps:

1. **Upload Files**: Upload all server files to `/home/adeiensa/public_html/api/`

2. **Install Dependencies**:
   ```bash
   cd /home/adeiensa/public_html/api/
   npm install
   ```

3. **Check Environment Variables**:
   - Ensure `.env` file has correct database credentials
   - Verify JWT_SECRET is set
   - Check PORT configuration

4. **Test API Endpoints**:
   - Visit: `https://api.adei-ensaf.ma/health`
   - Visit: `https://api.adei-ensaf.ma/api/test`
   - Visit: `https://api.adei-ensaf.ma/` (API interface)

## Common Issues & Solutions:

### "Cannot find module" errors:
- ✅ **Fixed**: Added error handling for missing modules
- ✅ **Fixed**: Embedded fallback API interface in index.js
- Ensure all required files are uploaded

### Database Connection Issues:
- Check database credentials in `.env`
- Verify database server is running
- Test connection manually

### Permission Issues:
- Ensure `uploads/` directory has write permissions
- Check file ownership and permissions

## Production URLs:
- API Root: `https://api.adei-ensaf.ma/`
- Health Check: `https://api.adei-ensaf.ma/health`
- News: `https://api.adei-ensaf.ma/api/news`
- Events: `https://api.adei-ensaf.ma/api/events`
- Clubs: `https://api.adei-ensaf.ma/api/clubs`
- Filières: `https://api.adei-ensaf.ma/api/filieres`

## Error Handling:
The server now includes robust error handling for:
- Missing module files
- Database connection failures
- File upload issues
- Authentication errors

All errors are logged server-side while showing user-friendly messages to clients.