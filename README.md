# 🧸 PlayPro2 - Modern Toy Subscription Website

A modern, responsive toy subscription website built with Next.js 14, TypeScript, and Tailwind CSS featuring glassmorphism effects, advanced animations, and a complete e-commerce experience.

![PlayPro2 Preview](https://img.shields.io/badge/Next.js-14.2.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🚀 Features

- 🎨 **Modern 2025 UI Design** with glassmorphism effects and smooth animations
- 🛒 **Complete Shopping Cart** functionality with persistent state
- 👤 **Authentication System** with demo accounts and admin panel
- 📱 **Fully Responsive** design for all devices
- ⚡ **Server-Side Rendering** with Next.js App Router
- 🎪 **Admin Dashboard** for toy and subscription management
- 💳 **Subscription Plans** with pricing tiers
- 🔍 **Product Catalog** with filtering and search
- 📞 **Contact System** with form handling

## 🛠️ Technology Stack

- **Framework:** Next.js 14.2.5
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3.4.1
- **State Management:** Zustand 4.5.7
- **Icons:** Lucide React 0.427.0
- **Build Tools:** PostCSS, ESLint
- **Runtime:** React 18

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 16.0 or higher)
- **npm** (usually comes with Node.js)
- **Git** (for cloning the repository)

### Check your versions:
```bash
node --version    # Should be 16.0+
npm --version     # Should be 6.0+
git --version     # Any recent version
```

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/shivaop9464/playpro.git
cd playpro
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js and React
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Lucide React (icons)
- All development dependencies

### 3. Start the Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### 4. Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

## 📱 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the app for production |
| `npm run start` | Runs the built app in production mode |
| `npm run lint` | Runs ESLint to check code quality |

## 🏗️ Project Structure

```
playpro2/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about/             # About page
│   │   ├── admin/             # Admin dashboard
│   │   ├── cart/              # Shopping cart
│   │   ├── contact/           # Contact page
│   │   ├── login/             # User login
│   │   ├── pricing/           # Subscription plans
│   │   ├── signup/            # User registration
│   │   ├── toys/              # Product catalog
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable components
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── ToyCard.tsx
│   ├── lib/
│   │   └── utils.ts           # Utility functions
│   └── store/                 # Zustand state management
│       ├── auth.ts            # Authentication state
│       └── cart.ts            # Shopping cart state
├── data/                      # Static data files
│   ├── plans.json            # Subscription plans
│   └── toys.json             # Product data
├── public/                   # Static assets
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
├── next.config.mjs          # Next.js configuration
└── package.json             # Dependencies and scripts
```

## 🎮 Demo Accounts

The application comes with pre-configured demo accounts:

### Regular User Account
- **Email:** `demo@playpro.com`
- **Password:** `demo123`

### Admin Account
- **Email:** `admin@playpro.com`
- **Password:** `admin123`

*Note: These accounts are automatically created when you first visit the login page.*

## 🔐 Social Login (Google)

The application supports Google social login through Clerk authentication:

1. Visit the [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Go to "User & Authentication" > "Social Connections"
4. Enable Google and configure OAuth credentials
5. Disable other social providers if you only want Google
6. Add your domain to the allowed redirect URLs

For detailed setup instructions, visit `/social-login-setup` after starting the development server.

## 📞 Contact Information

The application includes a contact page with:
- **Phone:** +91-7893514424
- **Email:** hello@playpro.com
- **Location:** Bangalore, Karnataka

## 🌟 Key Features Walkthrough

### 1. Authentication
- User registration and login
- Persistent sessions using localStorage
- Admin role-based access

### 2. Shopping Experience
- Browse toy catalog with filtering
- Add items to cart
- Subscription plan selection
- Responsive design for mobile shopping

### 3. Admin Panel
- Toy inventory management
- User management
- Order processing
- Analytics dashboard

### 4. Modern UI Elements
- Glassmorphism design effects
- Smooth animations and transitions
- Gradient backgrounds
- Interactive hover states

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub (already done)
2. Visit [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Deploy with default settings

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `out` folder to Netlify
3. Configure as a static site

### Deploy to Other Platforms

The project can be deployed to any platform that supports Node.js:
- Railway
- Render
- Digital Ocean
- AWS
- Google Cloud

## 🛠️ Development

### Adding New Features

1. Create components in `src/components/`
2. Add pages in `src/app/`
3. Manage state in `src/store/`
4. Update data in `data/` folder

### Styling Guidelines

- Use Tailwind CSS classes
- Follow the glassmorphism design pattern
- Maintain responsive design principles
- Keep animations smooth and purposeful

## 🐛 Troubleshooting

### Common Issues

**Port 3000 already in use:**
```bash
npx kill-port 3000
npm run dev
```

**Dependencies not installing:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
```bash
npm run lint
# Fix any issues shown
```

**Build failing:**
```bash
npm run build
# Check for any compilation errors
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📞 Support

If you encounter any issues or need help:

1. Check the troubleshooting section above
2. Open an issue on GitHub
3. Contact via email: hello@playpro.com
4. Call: +91-7893514424

## 🎯 Future Enhancements

- [ ] Payment gateway integration
- [ ] Real-time notifications
- [ ] User reviews and ratings
- [ ] Advanced search and filtering
- [ ] Mobile app development
- [ ] API integration for dynamic data
- [ ] Multi-language support

---

**Developed with ❤️ using Next.js, TypeScript, and Tailwind CSS**

⭐ **Star this repository if you find it helpful!**