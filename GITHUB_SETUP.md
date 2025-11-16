# GitHub Setup Instructions

## Required GitHub Secrets

Before the GitHub Actions workflows can run, you need to add these secrets to your repository:

### How to Add Secrets:
1. Go to your repository: https://github.com/sunoy2004/SmartNote-AI
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret below:

### Firebase Configuration Secrets:

| Secret Name | Value |
|-------------|-------|
| `REACT_APP_FIREBASE_API_KEY` | `AIzaSyBC0w90_1pms-Swd4vTjXRCAX4uAUSFKYI` |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | `smartnote-ai-3d0fd.firebaseapp.com` |
| `REACT_APP_FIREBASE_PROJECT_ID` | `smartnote-ai-3d0fd` |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | `smartnote-ai-3d0fd.firebasestorage.app` |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | `5387598710` |
| `REACT_APP_FIREBASE_APP_ID` | `1:5387598710:web:b12a7656ee733c683b9857` |
| `REACT_APP_FIREBASE_MEASUREMENT_ID` | `G-K22251QX0G` |

### Firebase Deployment Token:

1. Install Firebase CLI locally: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Get CI token: `firebase login:ci`
4. Copy the token and add it as secret:

| Secret Name | Value |
|-------------|-------|
| `FIREBASE_TOKEN` | `[Token from firebase login:ci]` |

## After Adding Secrets

Once all secrets are added, push to the `main` branch to trigger:
- **Web Deployment**: Automatically deploys to Firebase Hosting
- **Android Build**: Will be available once Capacitor is set up

## Web App URL

After the first successful deployment, your app will be available at:
- **Firebase Hosting URL**: `https://smartnote-ai-3d0fd.web.app`
- **Custom Domain** (if configured): Your custom domain

## Android APK Build

The Android build workflow is set up but requires Capacitor configuration. See `runbook_next_steps.md` for mobile app setup instructions.

