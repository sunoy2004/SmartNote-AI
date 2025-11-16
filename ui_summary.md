# SmartNote AI - UI Analysis Summary

## Project Overview

SmartNote AI is a React + TypeScript web application built with Vite, using shadcn/ui components (Radix UI + Tailwind CSS) for a modern, accessible UI. The application is designed to revolutionize note-taking by providing real-time lecture transcription, AI-powered summarization, and automatic subject categorization.

## Architecture

- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.19
- **Routing**: React Router DOM 6.30.1
- **UI Library**: shadcn/ui (40+ components based on Radix UI)
- **Styling**: Tailwind CSS 3.4.17 with custom theme
- **State Management**: React Query (TanStack Query) 5.83.0
- **Form Handling**: React Hook Form 7.61.1 + Zod 3.25.76

## File Structure Analysis

### Pages (11 files)
All pages are located in `src/pages/`:

1. **Landing.tsx** - Public landing page with hero, features, and CTA
2. **Login.tsx** - Email/password login (TODO: Firebase auth)
3. **Signup.tsx** - User registration (TODO: Firebase auth)
4. **SubjectSetup.tsx** - Onboarding flow for subject setup (TODO: Firebase save)
5. **Dashboard.tsx** - Main dashboard with stats and recent notes (TODO: Firebase data)
6. **Record.tsx** - Real-time recording interface (TODO: Web Speech API, Firebase save)
7. **NoteDetail.tsx** - Individual note view with export (TODO: Firebase data, PDF export)
8. **Subjects.tsx** - Subject management page (TODO: Firebase data)
9. **Settings.tsx** - User settings
10. **NotFound.tsx** - 404 page
11. **Index.tsx** - Index page (if used)

### Components
- **DashboardLayout.tsx** - Authenticated layout wrapper with navigation
- **NavLink.tsx** - Navigation link component
- **ui/** - 40+ shadcn/ui components (Button, Card, Input, Dialog, etc.)

### Hooks
- **use-mobile.tsx** - Mobile device detection
- **use-toast.ts** - Toast notification hook

### Utilities
- **lib/utils.ts** - Utility functions (cn for className merging)

## Integration Points for Firebase

### 1. Authentication (`src/services/auth.js`)
**Files to modify:**
- `src/pages/Login.tsx` (line 21)
- `src/pages/Signup.tsx` (line 33)

**Implementation:**
- Replace setTimeout mock with `loginWithEmail()` and `signUpWithEmail()`
- On signup success, create user document in Firestore
- Redirect to `/subject-setup` if subjects array is empty
- Redirect to `/dashboard` if subjects exist

### 2. Subject Management (`src/hooks/useSubjects.tsx`)
**Files to modify:**
- `src/pages/SubjectSetup.tsx` (line 41)
- `src/pages/Subjects.tsx` (line 15)

**Implementation:**
- Create hook to manage `users/{uid}/subjects` collection
- Add/remove subjects with Firestore operations
- Check if user has subjects on app load (onboarding flow)

### 3. Recording & Transcription (`src/hooks/useRecorder.tsx`)
**Files to modify:**
- `src/pages/Record.tsx` (lines 20, 43)

**Implementation:**
- Create hook using Web Speech API for real-time transcription
- Store interim and final transcripts
- On stop, save to Firestore `users/{uid}/notes/{noteId}`
- Include audio blob upload to Firebase Storage (optional)

### 4. Note Management
**Files to modify:**
- `src/pages/Dashboard.tsx` (line 9)
- `src/pages/NoteDetail.tsx` (line 14)

**Implementation:**
- Query `users/{uid}/notes` collection
- Display notes sorted by createdAt
- Fetch individual note by ID for detail view

### 5. Summary & Subject Detection
**Files to create:**
- `src/services/summary.js` - Client-side summarization (MVP: TextRank, future: LLM)
- `src/services/subjectDetector.js` - Keyword-based subject detection

**Files to modify:**
- `src/pages/Record.tsx` - Integrate summary and subject detection

### 6. Export Utilities (`src/lib/exportUtils.ts`)
**Files to modify:**
- `src/pages/NoteDetail.tsx` (lines 44, 52)

**Implementation:**
- PDF export using jsPDF or html2pdf
- Web Share API for sharing
- Copy to clipboard functionality

## Branding Removal

### Files with "Lovable" references:
1. **README.md** - 8 occurrences (replace with SmartNote AI project info)
2. **index.html** - 3 meta tags (replace og:image and twitter:site)
3. **vite.config.ts** - 1 import (remove lovable-tagger, keep componentTagger optional)
4. **package.json** - 1 dev dependency (remove lovable-tagger)

### Replacement Strategy:
- Replace "Lovable" with "SmartNote AI" in visible text
- Remove lovable-tagger from package.json and vite.config.ts
- Update meta tags in index.html to use SmartNote AI branding
- Rewrite README.md with SmartNote AI project information

## Responsive Design

The application uses Tailwind's responsive breakpoints throughout:
- `sm:` - 640px+
- `md:` - 768px+
- `lg:` - 1024px+

All pages are mobile-first and include:
- Responsive navigation (hidden labels on mobile)
- Flexible grid layouts
- Touch-friendly button sizes
- Mobile-optimized forms

## Security Considerations

1. **Environment Variables**: All Firebase config must be in `.env` (not committed)
2. **Firestore Rules**: Users can only access their own documents
3. **API Keys**: Never expose OpenAI/LLM keys in client-side code (use serverless functions)
4. **Audio Storage**: Secure Firebase Storage rules for user audio files

## Next Steps (After Initial Scaffolding)

1. **Server-Side Summarization**: Create Firebase Cloud Function for LLM-based summaries
2. **Audio Processing**: Serverless function to process audio with Whisper API
3. **Subject Detection ML**: Upgrade from keyword matching to ML classifier
4. **Mobile App**: Set up Capacitor for Android/iOS builds
5. **Analytics**: Integrate Firebase Analytics for user behavior tracking
6. **Error Logging**: Add Sentry for production error monitoring

## Testing Strategy

- Unit tests for hooks (useRecorder, useSubjects)
- Integration tests for auth flow
- E2E tests for recording and note saving
- Accessibility tests (axe-core)

## Deployment

- **Web**: Firebase Hosting (via GitHub Actions)
- **Mobile**: GitHub Actions → Android APK build (Capacitor)
- **CI/CD**: Automated testing and deployment on push to main

