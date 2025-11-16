# Deployment Guide

## Firebase Hosting URLs

Your app will be available at:
- **Primary URL**: https://smartnote-ai-3d0fd.web.app
- **Alternative URL**: https://smartnote-ai-3d0fd.firebaseapp.com

## Local Deployment Setup

### 1. Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

This will open a browser window for authentication.

### 3. Initialize Firebase (Already Done)

The project is already initialized with:
- `firebase.json` - Hosting configuration
- `.firebaserc` - Project ID configuration

### 4. Build the App

```bash
npm run build
```

This creates the `dist` folder with production-ready files.

### 5. Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

Or deploy everything (hosting + Firestore rules):

```bash
firebase deploy
```

## GitHub Actions Automatic Deployment

The GitHub Actions workflow will automatically:
1. Build the app with your Firebase config from secrets
2. Deploy to Firebase Hosting on every push to `main` branch

### Required GitHub Secrets

Make sure you've added all secrets as described in `GITHUB_SETUP.md`:
- `FIREBASE_TOKEN` - Get this by running `firebase login:ci`
- All `REACT_APP_FIREBASE_*` variables

## Deploy Firestore Rules

To deploy Firestore security rules:

```bash
firebase deploy --only firestore:rules
```

## View Deployment History

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `smartnote-ai-3d0fd`
3. Go to **Hosting** section
4. View deployment history and rollback if needed

## Troubleshooting

### Build Fails
- Check that all environment variables are set in GitHub Secrets
- Verify Firebase project ID matches: `smartnote-ai-3d0fd`

### Deployment Fails
- Verify `FIREBASE_TOKEN` secret is set correctly
- Check Firebase CLI is installed in GitHub Actions
- Ensure you have proper permissions on the Firebase project

### App Not Loading
- Check browser console for errors
- Verify Firestore rules are deployed
- Ensure Authentication is enabled in Firebase Console

## Next Steps

1. **Set up GitHub Secrets** (see `GITHUB_SETUP.md`)
2. **Push to main branch** - This will trigger automatic deployment
3. **Access your app** at https://smartnote-ai-3d0fd.web.app

