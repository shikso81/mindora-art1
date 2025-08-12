# Overview

MINDORA.ART is a creative platform that enables users to create, share, and explore digital art. The application features user authentication, a gallery system for viewing artwork, creation tools for generating content, and user profile management. It's built as a modern web application with a focus on visual aesthetics and user experience.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Technology Stack**: Pure HTML, CSS, and JavaScript with Bootstrap 5.3.0 for responsive UI components
- **Design Pattern**: Multi-page application (MPA) with separate HTML files for different sections
- **Styling Approach**: Custom CSS with CSS variables for theming and gradient-based design system
- **Responsive Design**: Bootstrap grid system with mobile-first approach

## Authentication System
- **Provider**: Firebase Authentication for user management
- **Features**: Sign-in/sign-up functionality with persistent sessions
- **State Management**: Real-time authentication state monitoring across all pages
- **UI Integration**: Dynamic navigation updates based on authentication status

## Data Storage
- **Primary Database**: Firebase Firestore for storing user data and artwork metadata
- **File Storage**: Firebase Storage for artwork files and user assets
- **Offline Support**: Firestore persistence enabled for offline functionality
- **Data Structure**: Document-based NoSQL architecture

## Application Structure
- **Home Page** (`index.html`): Landing page with authentication and navigation
- **Gallery** (`gallery.html`): Public artwork viewing interface
- **Create** (`create.html`): Content creation tools (authenticated users only)
- **Profile** (`profile.html`): User profile management
- **Modular JavaScript**: Separate authentication module (`auth.js`) and main application logic (`script.js`)

## Security Considerations
- **Authentication**: Firebase security rules for data access control
- **Environment Variables**: Configuration designed for environment-based secrets management
- **Client-side Validation**: Form validation and user input sanitization

# External Dependencies

## Core Services
- **Firebase Platform**: Complete backend-as-a-service solution
  - Firebase Authentication for user management
  - Firestore database for data storage
  - Firebase Storage for file management
  - Firebase Hosting (implied for deployment)

## Frontend Libraries
- **Bootstrap 5.3.0**: UI framework for responsive design and components
- **Font Awesome 6.4.0**: Icon library for consistent iconography
- **Firebase SDK**: Client-side libraries for Firebase service integration

## Browser APIs
- **Local Storage**: For client-side data persistence
- **Service Workers**: Implied for offline functionality through Firestore
- **File API**: For artwork upload and management functionality