# Deployment Guide for OpenSourceCloud

## Prerequisites

1. OpenSourceCloud account
2. Docker installed locally (for testing)
3. Google Cloud service account credentials JSON file

## Deployment Steps

### Option 1: Docker Deployment

1. **Build the Docker image**:
   ```bash
   docker build -t swedish-translator .
   ```

2. **Test locally with Docker**:
   ```bash
   docker run -p 3000:3000 \
     -e GOOGLE_APPLICATION_CREDENTIALS=/app/google-credentials.json \
     -v $(pwd)/google-credentials.json:/app/google-credentials.json \
     swedish-translator
   ```

3. **Push to container registry** (if OpenSourceCloud uses one):
   ```bash
   docker tag swedish-translator your-registry/swedish-translator:latest
   docker push your-registry/swedish-translator:latest
   ```

### Option 2: Direct Deployment

1. **Prepare deployment package**:
   - Ensure `google-credentials.json` is in the project root
   - Make sure `.env` is configured correctly
   - All dependencies are in `package.json`

2. **Upload to OpenSourceCloud**:
   - Use their deployment interface
   - Upload the entire project directory
   - Or use Git deployment if supported

### Environment Variables for OpenSourceCloud

Set these in your OpenSourceCloud dashboard:

```
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
PORT=3000
NODE_ENV=production
```

### Important Notes

1. **Credentials File**:
   - The `google-credentials.json` must be uploaded to OpenSourceCloud
   - Set proper file permissions (readable by app, not publicly accessible)
   - Consider using OpenSourceCloud's secrets management if available

2. **Port Configuration**:
   - OpenSourceCloud may assign a different port
   - The app reads from `process.env.PORT`, so it will adapt automatically

3. **Persistent Storage**:
   - Translation history is stored in `translations-history.json`
   - For persistent storage across restarts, use OpenSourceCloud's volume mounts
   - Or migrate to a database (MongoDB, PostgreSQL, etc.)

### Security Checklist

- ✅ `.gitignore` excludes sensitive files
- ✅ Environment variables for configuration
- ✅ No hardcoded credentials
- ✅ HTTPS recommended for production
- ✅ Consider adding rate limiting for API endpoints

### Upgrading to Database (Optional)

For production use, consider replacing the JSON file storage with a database:

**MongoDB Example**:
```javascript
// Replace fs.readFile/writeFile with MongoDB queries
const { MongoClient } = require('mongodb');
// Store translations in MongoDB collection
```

**PostgreSQL Example**:
```javascript
// Use pg library for PostgreSQL
const { Pool } = require('pg');
// Store translations in PostgreSQL table
```

### Monitoring

Add logging and monitoring:
- Use `morgan` for HTTP request logging
- Consider APM tools (New Relic, DataDog, etc.)
- Set up health check endpoints

### Support

For issues with:
- **Google Cloud**: Check Translation API quotas and billing
- **OpenSourceCloud**: Contact their support for deployment issues
- **Application**: Check server logs for errors

## Quick Start Commands

```bash
# Install dependencies
npm install

# Start in production mode
NODE_ENV=production npm start

# Build Docker image
docker build -t swedish-translator .

# Run with Docker
docker run -p 3000:3000 swedish-translator
```
