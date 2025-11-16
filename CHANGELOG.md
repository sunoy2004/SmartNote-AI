# Changelog

All notable changes to SmartNote AI will be documented in this file.

## [Unreleased]

### Added
- Initial project setup with React + TypeScript + Vite
- shadcn/ui component library integration
- Firebase configuration scaffolding
- Authentication service (email/password)
- Firestore schema and security rules
- Subject management hook (`useSubjects`)
- Recording hook (`useRecorder`) with Web Speech API
- Summary generation service (client-side MVP)
- Subject detection service (keyword-based MVP)
- Export utilities (PDF, copy, share)
- Environment variable configuration
- Documentation (env.md, ci-cd.md, analytics.md, accessibility_report.md, responsive-checklist.md)
- GitHub Actions workflows for CI/CD

### Changed
- Removed Lovable branding from all files
- Updated README.md with SmartNote AI project information
- Updated meta tags in index.html
- Removed lovable-tagger from dependencies

### Security
- Added .env to .gitignore
- Created .env.example template
- Implemented Firestore security rules (users can only access their own data)

## Commits

### chore/remove-generator-branding
- Removed all references to "Lovable" from README.md, index.html, vite.config.ts, and package.json
- Replaced with "SmartNote AI" branding

### chore/add-env-example-and-ignore
- Created .env.example with Firebase configuration template
- Added .env files to .gitignore

### feat/firebase-auth-scaffold
- Created `src/firebase/config.ts` for Firebase initialization
- Created `src/services/auth.ts` with signUpWithEmail, loginWithEmail, logout, and auth state listeners
- Added user document creation on signup

### feat/onboarding-subject-setup
- Created `src/hooks/useSubjects.tsx` for subject management
- Subject CRUD operations with Firestore
- Onboarding check helper function

### feat/recorder-hook-and-ui-wiring
- Created `src/hooks/useRecorder.tsx` for real-time recording
- Web Speech API integration for transcription
- Audio blob capture for storage

### feat/mvp-summary-and-subject-detection
- Created `src/services/summary.ts` with client-side TextRank-like summarization
- Created `src/services/subjectDetector.ts` with keyword-based subject detection
- Placeholder functions for future server-side LLM integration

### feat/audio-storage-and-export-utils
- Created `src/lib/exportUtils.ts` with PDF export, copy, and share functionality
- jsPDF integration for note export

### chore/add-github-actions-skeleton
- Created `.github/workflows/build-and-host.yml` for Firebase Hosting deployment
- Created `.github/workflows/build-android.yml` placeholder for mobile builds

### test/add-basic-smoke-tests
- TODO: Add Jest and React Testing Library tests

### chore/add-accessibility-and-responsive-checklist
- Created `docs/accessibility_report.md` with WCAG compliance checklist
- Created `docs/responsive-checklist.md` with responsive design verification

## Next Steps

See `runbook_next_steps.md` for detailed next implementation tasks.

