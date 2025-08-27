#!/bin/bash

# PlayPro2 Netlify Deployment Script

echo "🚀 Preparing PlayPro2 for Netlify deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build output in .next directory"
    echo ""
    echo "🌐 Ready for Netlify deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Push changes to GitHub"
    echo "2. Connect repository to Netlify"
    echo "3. Set environment variables in Netlify dashboard"
    echo "4. Deploy!"
else
    echo "❌ Build failed!"
    exit 1
fi