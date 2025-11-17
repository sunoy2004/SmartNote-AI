# Environment Variables Setup

This document explains how to configure environment variables for SmartNote AI.

## Required Environment Variables

All Firebase configuration values are required for the app to function. The OpenAI API key is optional and only used for server-side summarization.

## Getting Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the gear icon ⚙️ next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. If you don't have a web app, click "Add app" and select the web icon (</>)
7. Copy the configuration values from the `firebaseConfig` object

## Setting Up Environment Variables

### Step 1: Copy the example file

```bash
cp .env.example .env
```

### Step 2: Fill in your Firebase values

Open `.env` and fill in the values:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key-here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef
REACT_APP_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 3: Optional - OpenAI API Key

If you plan to use server-side LLM summarization (via Firebase Cloud Functions), add your OpenAI API key:

```env
REACT_APP_OPENAI_API_KEY=sk-...
```

**⚠️ Important**: Never commit your `.env` file to version control. It's already in `.gitignore`.

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_FIREBASE_API_KEY` | Yes | Firebase API key |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Yes | Firebase authentication domain |
| `REACT_APP_FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Yes | Firebase Storage bucket name |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase Cloud Messaging sender ID |
| `REACT_APP_FIREBASE_APP_ID` | Yes | Firebase app ID |
| `REACT_APP_FIREBASE_MEASUREMENT_ID` | Yes | Firebase Analytics measurement ID |
| `REACT_APP_OPENAI_API_KEY` | No | OpenAI API key (server-side only) |
| `VITE_ENABLE_CUSTOM_MODELS` | No | Set to `true` only when the local Python ML API is running (defaults to false) |

## Firebase Services Setup

Before running the app, ensure these Firebase services are enabled:

1. **Authentication**
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" provider

2. **Firestore Database**
   - Go to Firestore Database
   - Create database in production mode (we'll add rules separately)
   - Deploy security rules from `firebase/firestore.rules`

3. **Storage** (optional, for audio files)
   - Go to Storage
   - Get started with default rules (we'll secure them later)

## Verifying Configuration

After setting up your `.env` file, start the dev server:

```bash
npm run dev
```

Check the browser console for any Firebase initialization errors. If you see "Missing required Firebase environment variables", double-check your `.env` file.

## Production Deployment

For production deployment (Firebase Hosting), set environment variables in:

1. **Firebase Hosting**: Use Firebase Hosting environment variables (if available)
2. **GitHub Actions**: Use GitHub Secrets (see `docs/ci-cd.md`)
3. **Build-time**: Vite will embed these at build time (they're public in the client bundle)

**Note**: Since these are `REACT_APP_*` variables, they will be embedded in the client bundle. This is safe for Firebase config, but never expose sensitive API keys this way. Use Firebase Cloud Functions for server-side operations requiring secrets.

