# PlayPro2 - Netlify Deployment Guide

## 🚀 Quick Deploy to Netlify

Your PlayPro2 Next.js application is ready for Netlify deployment!

### Prerequisites
- ✅ GitHub repository: https://github.com/shivaop9464/playpro.git
- ✅ Netlify account (free)
- ✅ Supabase project configured

### Deployment Steps

#### Option 1: GitHub Integration (Recommended)

1. **Visit Netlify Dashboard**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"

2. **Connect Repository**
   - Choose "GitHub"
   - Select your repository: `shivaop9464/playpro`
   - Branch: `main`

3. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

4. **Environment Variables**
   Go to Site settings > Environment variables and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://psvbkajqnskutsfgmesn.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NODE_VERSION=18
   ```

5. **Deploy**
   - Click "Deploy site"
   - Your app will be live at `https://your-app-name.netlify.app`

#### Option 2: Drag & Drop Deploy

1. **Build Locally**
   ```bash
   npm run build
   ```

2. **Deploy**
   - Drag the `.next` folder to Netlify dashboard
   - Set environment variables manually

### Post-Deployment Setup

#### Update Supabase Auth Settings
1. Go to Supabase Dashboard > Authentication > URL Configuration
2. Add your Netlify domain to:
   - **Site URL**: `https://your-app-name.netlify.app`
   - **Redirect URLs**: `https://your-app-name.netlify.app/auth/callback`

#### Configure Social Auth (Optional)
For Google/Facebook/Apple login:
1. Update redirect URLs in your OAuth provider settings
2. Add Netlify domain to allowed origins

### 🔧 Configuration Files

- `netlify.toml` - Netlify configuration
- `next.config.mjs` - Next.js optimization for Netlify
- `.env.netlify` - Environment variables template

### 📱 Features Available After Deployment

✅ **Authentication System**
- Email/password signup and login
- Social login (Google, Facebook, Apple) *
- Admin panel access
- Fallback localStorage authentication

✅ **E-commerce Features**
- Product catalog (toys)
- Shopping cart functionality
- Admin product management
- Price handling and display

✅ **Modern UI**
- Responsive design
- Glassmorphism effects
- Modern animations
- Mobile-optimized

*Social login requires OAuth provider configuration

### 🐛 Troubleshooting

**Build Errors:**
- Check Node.js version (should be 18+)
- Verify all environment variables are set
- Review build logs in Netlify dashboard

**Authentication Issues:**
- Verify Supabase URL configuration
- Check redirect URLs match your domain
- Ensure CORS settings in Supabase

**Social Login Not Working:**
- Configure OAuth providers in Supabase
- Update redirect URLs with your Netlify domain

### 📞 Support

If you encounter issues:
1. Check Netlify build logs
2. Verify environment variables
3. Test locally with `npm run build`

---

**Live Demo:** https://your-app-name.netlify.app
**GitHub:** https://github.com/shivaop9464/playpro.git