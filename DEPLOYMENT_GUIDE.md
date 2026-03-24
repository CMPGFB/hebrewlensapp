# HebrewLens Deployment Guide

## GitHub Repository Setup

### 1. Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: HebrewLens v1.0 - Hebrew Translation Platform"
```

### 2. Create GitHub Repository
1. Go to [GitHub](https://github.com) and create a new repository named `hebrewlens`
2. Don't initialize with README (we already have one)
3. Copy the repository URL

### 3. Connect and Push to GitHub
```bash
git remote add origin https://github.com/yourusername/hebrewlens.git
git branch -M main
git push -u origin main
```

## Environment Variables

### Development (.env)
```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### Production Deployment
When deploying to platforms like Vercel, Netlify, or others, add these environment variables:
- `VITE_OPENAI_API_KEY` (optional - for AI-enhanced translations)

## Deployment Options

### Option 1: Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel will auto-detect Vite configuration
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Option 2: Netlify
1. Connect GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Option 3: GitHub Pages
```bash
npm run build
# Deploy the dist folder to GitHub Pages
```

## Build Commands
```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Domain Setup
1. Purchase domain (hebrewlens.com)
2. Configure DNS to point to your deployment platform
3. Set up SSL certificate (usually automatic)

## Post-Deployment Checklist
- [ ] Test all translation functionality
- [ ] Verify Hebrew alphabet scrolling works
- [ ] Test share card generation and download
- [ ] Check donation links work correctly
- [ ] Verify responsive design on mobile
- [ ] Test all external links (Bitcoin, PayPal, etc.)
- [ ] Confirm favicon displays correctly
- [ ] Test OpenAI integration (if API key provided)

## Monitoring and Analytics
Consider adding:
- Google Analytics for usage tracking
- Error monitoring (Sentry)
- Performance monitoring
- User feedback collection

## Security Notes
- OpenAI API key is exposed client-side (consider backend proxy for production)
- All donation links are external and secure
- No user data is stored or collected
- Static site deployment is inherently secure

## Support and Maintenance
- Monitor donation platform functionality
- Keep dependencies updated
- Review and respond to user feedback
- Consider adding new Hebrew learning features

---

Ready to launch HebrewLens and share the beauty of Hebrew with the world! 🚀