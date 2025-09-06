# 🚀 Deploying PlayPro2 to Render

This guide will walk you through deploying the PlayPro2 application to Render, a cloud platform for hosting web applications.

## Prerequisites

1. A Render account (create one at [render.com](https://render.com))
2. A GitHub account with the PlayPro2 repository
3. Environment variables from third-party services (Supabase, Razorpay, Clerk)

## Deployment Steps

### 1. Create a New Web Service on Render

1. Log in to your Render account
2. Click on "New" and select "Web Service"
3. Connect your GitHub account when prompted
4. Select the repository containing the PlayPro2 code

### 2. Configure Your Web Service

Fill in the following settings:

- **Name**: `playpro2` (or your preferred name)
- **Region**: Choose the region closest to your users
- **Branch**: `main`
- **Root Directory**: Leave empty (root of repository)
- **Environment**: `Node`
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Auto-Deploy**: `Yes` (recommended)

### 3. Configure Environment Variables

In the "Advanced" section, add the following environment variables:

#### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

#### Razorpay Configuration
```
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

#### Clerk Configuration
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 4. Deploy Your Application

1. Click "Create Web Service"
2. Render will automatically start building and deploying your application
3. The build process typically takes 5-10 minutes
4. Once complete, your application will be available at the provided URL

## Environment Variable Details

### Supabase Configuration

1. Go to your Supabase project dashboard
2. Navigate to "Project Settings" > "API"
3. Copy the following values:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role secret → `SUPABASE_SERVICE_ROLE_KEY`

### Razorpay Configuration

1. Log in to your Razorpay Dashboard
2. Navigate to "Settings" > "API Keys"
3. Generate or copy the following values:
   - Key ID → `NEXT_PUBLIC_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_ID`
   - Key Secret → `RAZORPAY_KEY_SECRET`

### Clerk Configuration

1. Go to your Clerk Dashboard
2. Select your application
3. Navigate to "API Keys"
4. Copy the following values:
   - Publishable Key → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Secret Key → `CLERK_SECRET_KEY`

## Custom Domain (Optional)

To use a custom domain:

1. In your Render dashboard, go to your web service
2. Click on "Settings" tab
3. Scroll to "Custom Domains" section
4. Add your domain and follow the DNS instructions

## Monitoring and Logs

Render provides built-in monitoring and logging:

1. Go to your web service dashboard
2. View real-time logs in the "Logs" tab
3. Monitor performance in the "Metrics" tab

## Troubleshooting

### Build Failures

If your build fails:

1. Check the build logs for specific error messages
2. Verify all environment variables are correctly set
3. Ensure your repository has the latest changes

### Application Not Starting

If the application doesn't start after deployment:

1. Check the runtime logs for errors
2. Verify environment variables are properly configured
3. Ensure the start command is correct (`npm run start`)

### Database Connection Issues

If you're experiencing database connection issues:

1. Double-check Supabase URL and keys
2. Verify your Supabase project allows connections from Render
3. Check if you need to update your Supabase database settings

## Updating Your Application

To update your deployed application:

1. Push changes to your GitHub repository
2. Render will automatically detect changes and start a new deployment
3. You can also manually trigger a deployment from the Render dashboard

## Scaling

Render automatically scales your application based on traffic. For more control:

1. Go to your web service settings
2. Adjust the instance count and size as needed
3. Configure autoscaling rules if available

## Support

If you encounter issues with deployment:

1. Check Render's [documentation](https://render.com/docs)
2. Visit Render's [community forum](https://community.render.com/)
3. Contact Render support through your dashboard