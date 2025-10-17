# Avans Student Portal - Frontend

A modern, mobile-first student portal application built with React, TypeScript, and Bootstrap, designed for Avans University students.

## 🎨 Design System

### Brand Colors
- **Primary**: `#c6002a` (Avans Red)
- **Primary Dark**: `#a5001f`
- **Primary Light**: `#e2335e`

### Features
- 🌙 **Dark Mode**: Optimized dark theme for better user experience
- 📱 **Mobile First**: Responsive design optimized for mobile devices
- ⚡ **Modern UI**: Built with Bootstrap 5 and custom styling
- 🔒 **Secure Authentication**: Protected routes and user management
- ♿ **Accessible**: WCAG compliant design with proper focus management

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Bootstrap 5 + Custom CSS
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Development**: ESLint + TypeScript

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Avans-2.1-LU1-POC-frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.tsx   # Main navigation bar
│   └── RouteProtection.tsx  # Authentication guards
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── About.tsx       # About page
│   ├── Login.tsx       # Login form
│   ├── Register.tsx    # Registration form
│   └── Dashboard.tsx   # Protected dashboard
├── styles/             # Global styles
│   └── globals.css     # Main stylesheet with Avans branding
└── App.tsx             # Main application component
```

## 🎯 Key Features

### Authentication System
- User registration and login
- Protected routes for authenticated users
- Role-based access (Student, Teacher, Admin)
- Secure logout functionality

### Responsive Design
- Mobile-first approach using Bootstrap's grid system
- Responsive navigation with collapsible menu
- Optimized forms and UI elements for all screen sizes

### User Experience
- Loading states with custom Avans-branded spinners
- Consistent error handling and user feedback
- Smooth transitions and hover effects
- Accessibility-focused design

## 🎨 Styling Guide

### Custom CSS Classes
- `.bg-dark-custom`: Dark background color
- `.bg-darker-custom`: Darker background color
- `.text-light-custom`: Light text color
- `.text-muted-custom`: Muted text color
- `.spinner-avans`: Custom loading spinner

### Bootstrap Overrides
All Bootstrap primary colors are overridden to use Avans brand colors. The application maintains Bootstrap's responsive utilities while applying the custom color scheme.

## 🔧 Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## 📱 Mobile Optimization

The application is built with a mobile-first approach:
- Touch-friendly button sizes
- Optimized form layouts for mobile devices
- Responsive navigation with hamburger menu
- Proper viewport meta tags for mobile browsers

## 🚀 Deployment

To build for production:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
