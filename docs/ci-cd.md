# CI/CD Guide

This document explains how to set up continuous integration and deployment for SmartNote AI.

## GitHub Actions Workflows

The project includes two GitHub Actions workflows:

1. **build-and-host.yml** - Build and deploy web app to Firebase Hosting
2. **build-android.yml** - Build Android APK (placeholder for future mobile app)

## Prerequisites

### 1. Firebase CLI

Install Firebase CLI globally:

```bash
npm install -g firebase-tools
```

### 2. Firebase Login

```bash
firebase login
```

### 3. Initialize Firebase in Project

```bash
firebase init
```

Select:
- ✅ Hosting
- ✅ Firestore (if not already initialized)

### 4. Get Firebase Token

Generate a CI token:

```bash
firebase login:ci
```

Copy the token - you'll need it for GitHub Secrets.

## GitHub Secrets Setup

Go to your GitHub repository > Settings > Secrets and variables > Actions, and add:

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `FIREBASE_TOKEN` | Firebase CI token | Run `firebase login:ci` |
| `FIREBASE_PROJECT_ID` | Your Firebase project ID | From Firebase Console |
| `REACT_APP_FIREBASE_API_KEY` | Firebase API key | From `.env` file |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | From `.env` file |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase project ID | From `.env` file |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Storage bucket | From `.env` file |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID | From `.env` file |
| `REACT_APP_FIREBASE_APP_ID` | Firebase app ID | From `.env` file |
| `REACT_APP_FIREBASE_MEASUREMENT_ID` | Analytics ID | From `.env` file |

## Web Deployment Workflow

The `build-and-host.yml` workflow:

1. Checks out code
2. Sets up Node.js
3. Installs dependencies
4. Builds the production app
5. Deploys to Firebase Hosting

**Trigger**: Pushes to `main` branch

## Android Build Workflow (Future)

The `build-android.yml` workflow is a placeholder for future mobile app builds using Capacitor or React Native.

**Status**: Not yet implemented - requires mobile framework setup

## Manual Deployment

### Web (Firebase Hosting)

```bash
# Build the app
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

### Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### Storage Rules (if using)

```bash
firebase deploy --only storage
```

## Environment-Specific Builds

### Development

```bash
npm run build:dev
```

### Production

```bash
npm run build
```

## Troubleshooting

### Build Fails: Missing Environment Variables

- Ensure all GitHub Secrets are set
- Check that `.env.example` matches the required variables
- Verify variable names start with `REACT_APP_`

### Firebase Deploy Fails: Authentication

- Regenerate Firebase token: `firebase login:ci`
- Update `FIREBASE_TOKEN` secret in GitHub

### Build Succeeds but App Doesn't Work

- Check browser console for Firebase initialization errors
- Verify Firebase services are enabled (Auth, Firestore, Storage)
- Ensure Firestore security rules are deployed

## Next Steps

1. Set up Firebase Hosting custom domain (optional)
2. Configure Firebase Analytics
3. Set up error monitoring (Sentry)
4. Implement mobile app build pipeline (Capacitor/React Native)

