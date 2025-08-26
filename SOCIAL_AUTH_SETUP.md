# Social Authentication Setup for Supabase

## Overview
This guide helps you configure Google, Facebook, and Apple authentication in your Supabase project.

## 🔧 Supabase Dashboard Configuration

### 1. Access Authentication Settings
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to your project: `psvbkajqnskutsfgmesn`
3. Go to **Authentication** → **Settings** → **Auth Providers**

### 2. Configure Site URL
**Important**: Set your site URL in **Authentication** → **Settings** → **General**:
- Site URL: `http://localhost:3000` (for development)
- Redirect URLs: `http://localhost:3000/auth/callback`

For production, update these to your actual domain.

## 🔐 Provider Setup Instructions

### Google OAuth Setup

1. **Create Google OAuth App**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: Web application
   - Authorized redirect URIs: `https://psvbkajqnskutsfgmesn.supabase.co/auth/v1/callback`

2. **Configure in Supabase**:
   - Enable Google provider in Supabase Auth settings
   - Add your Google Client ID and Client Secret
   - Save configuration

### Facebook OAuth Setup

1. **Create Facebook App**:
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app → Consumer type
   - Add Facebook Login product
   - Valid OAuth Redirect URIs: `https://psvbkajqnskutsfgmesn.supabase.co/auth/v1/callback`

2. **Configure in Supabase**:
   - Enable Facebook provider in Supabase Auth settings
   - Add your Facebook App ID and App Secret
   - Save configuration

### Apple OAuth Setup

1. **Create Apple Sign In**:
   - Go to [Apple Developer Console](https://developer.apple.com/)
   - Sign In with Apple → Configure
   - Create Service ID
   - Return URL: `https://psvbkajqnskutsfgmesn.supabase.co/auth/v1/callback`

2. **Configure in Supabase**:
   - Enable Apple provider in Supabase Auth settings
   - Add your Apple Client ID and Client Secret
   - Save configuration

## 📝 Testing Instructions

### Development Testing
1. Start your development server: `npm run dev`
2. Navigate to: `http://localhost:3000/login`
3. Click on any social login button
4. You should be redirected to the provider's login page
5. After successful authentication, you'll be redirected back to your app

### Production Deployment
1. Update site URLs in Supabase to your production domain
2. Update redirect URIs in each OAuth provider to use your production domain
3. Ensure HTTPS is enabled for production

## 🐛 Troubleshooting

### Common Issues:

**1. "Redirect URI mismatch"**
- Check that redirect URIs match exactly in provider settings
- Ensure you're using the correct Supabase project URL

**2. "Invalid client"**
- Verify Client ID and Secret are correctly entered in Supabase
- Check that OAuth app is properly configured in provider console

**3. "Access denied"**
- Ensure OAuth app is published/live (not in development mode)
- Check that required permissions are granted

**4. "User creation failed"**
- Verify database schema is properly set up
- Check that `handle_new_user()` trigger is working

### Enable Provider Debug Mode:
In Supabase Auth settings, you can enable debug mode to see detailed error messages.

## 🔒 Security Best Practices

1. **Never commit credentials**: Keep OAuth secrets in environment variables
2. **Use HTTPS in production**: Required for secure OAuth flows
3. **Validate redirect URIs**: Ensure only your domains are authorized
4. **Monitor auth logs**: Check Supabase auth logs for suspicious activity
5. **Implement rate limiting**: Prevent abuse of auth endpoints

## 📱 Mobile App Considerations

If you plan to add mobile apps:
- Configure additional redirect URIs for mobile deep links
- Use appropriate OAuth flows for each platform
- Consider using Supabase's mobile SDKs

## 🔄 Migration Notes

This setup replaces the previous email/password authentication with social-only authentication:
- Users must sign in through social providers
- No password reset functionality needed
- User profiles are created automatically from social provider data
- Existing email/password functionality has been removed

For questions or issues, refer to:
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [OAuth Provider Documentation](https://supabase.com/docs/guides/auth/social-login)