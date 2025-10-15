# Deployment Guide

## Quick Deploy Options

### 1. Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

### 2. Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### 3. GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
3. Run: `npm run deploy`

### 4. Surge.sh
1. Install Surge: `npm install -g surge`
2. Run: `npm run build && surge dist`

## Pre-Deployment Checklist

- [ ] Update domain URLs in `index.html` meta tags
- [ ] Update `sitemap.xml` with your domain
- [ ] Update `robots.txt` with your domain
- [ ] Test production build: `npm run build && npm run preview`
- [ ] Verify all features work in production mode

## Environment Variables (if needed)

Create `.env.production` for any production-specific variables:
```
VITE_APP_TITLE=Pokemon Guesser
VITE_APP_URL=https://your-domain.com
```

## Performance Optimization

The build is already optimized with:
- ✅ Code splitting
- ✅ Asset minification
- ✅ Gzip compression (112.50 kB JS, 2.01 kB CSS)
- ✅ Lazy loading for images
- ✅ Tree shaking

## Build Stats
- **Total JS**: 462.75 kB (112.50 kB gzipped)
- **Total CSS**: 7.60 kB (2.01 kB gzipped)
- **HTML**: 0.46 kB (0.30 kB gzipped)
- **Build Time**: ~500ms

## SEO Features
- ✅ Meta tags for social sharing
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Canonical URLs
- ✅ Sitemap
- ✅ Robots.txt
