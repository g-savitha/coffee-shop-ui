# Frontend Deployment Guide

## Netlify Deployment (Recommended)

1. Push your code to GitHub
2. Log in to Netlify
3. Click "New site from Git"
4. Choose your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `20.x`

### Environment Variables

Set the following in Netlify's environment variables:
```
VITE_API_URL=https://your-backend.railway.app
```

## Build Configuration

The project uses Vite's build system. Key features:
- Optimized asset bundling
- Code splitting
- Environment variable handling
- Static file serving

## Post-Deployment

1. Set up custom domain (optional)
2. Enable HTTPS
3. Configure redirect rules for SPA routing:

Create a `_redirects` file in the `public` directory:
```
/* /index.html 200
```

## Connecting to Backend

The frontend will automatically connect to the backend using the `VITE_API_URL` environment variable.

## Troubleshooting

- Ensure CORS is properly configured on the backend
- Verify environment variables are set correctly
- Check build logs for any errors
- Test API connectivity from the deployed frontend
