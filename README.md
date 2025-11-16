# SmartNote AI - Real-Time Lecture Notes Generator

## Project Overview

SmartNote AI is an intelligent note-taking application that revolutionizes how students capture and organize lecture content. The app uses real-time transcription, AI-powered summarization, and automatic subject detection to create organized, easy-to-review notes.

## Features

- 🎙️ **Real-Time Recording**: Live transcription using Web Speech API
- 🧠 **AI Summarization**: Automatic note generation and summarization
- 📚 **Smart Categorization**: Auto-detect and organize notes by subject
- 📱 **Cross-Platform**: Web app and mobile app support
- 🔒 **Secure**: Firebase authentication and Firestore database

## Technologies

This project is built with:

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React 18** - UI framework
- **shadcn/ui** - Beautiful component library
- **Tailwind CSS** - Utility-first CSS framework
- **Firebase** - Authentication, Firestore, and Hosting
- **React Router** - Client-side routing

## Getting Started

### Prerequisites

- Node.js 18+ and npm (install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Firebase project with Authentication and Firestore enabled

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd cl-notes-generator

# Step 3: Install dependencies
npm install

# Step 4: Set up environment variables
cp .env.example .env
# Edit .env with your Firebase configuration

# Step 5: Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`

## Environment Variables

See `docs/env.md` for detailed instructions on setting up Firebase configuration.

## Development

```sh
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Deployment

### Web (Firebase Hosting)

1. Build the project: `npm run build`
2. Deploy to Firebase: `firebase deploy --only hosting`

Or use GitHub Actions (see `.github/workflows/build-and-host.yml`)

### Mobile

See `docs/ci-cd.md` for Android build instructions via GitHub Actions.

## Project Structure

```
src/
├── pages/          # Route pages
├── components/     # React components
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
├── services/       # Firebase and API services
└── firebase/       # Firebase configuration
```

## Documentation

- [Environment Setup](docs/env.md)
- [Firestore Schema](firestore_schema.md)
- [CI/CD Guide](docs/ci-cd.md)
- [Analytics](docs/analytics.md)
- [Accessibility Report](docs/accessibility_report.md)

## License

Copyright © 2024 SmartNote AI. All rights reserved.
