# Next Steps - Implementation Roadmap

This document outlines the next 6 technical tasks to complete the SmartNote AI implementation.

## 1. Server-Side Summarization (Firebase Cloud Functions)

**Priority**: High  
**Estimated Time**: 4-6 hours

### Tasks:
- Create Firebase Cloud Function for LLM-based summarization
- Integrate OpenAI API (or alternative: Anthropic, Cohere)
- Update note documents with `serverSummary` field
- Add retry logic and error handling
- Implement rate limiting

### Files to Create:
- `functions/src/summarize.ts` - Cloud Function for summarization
- `functions/package.json` - Functions dependencies

### Integration Points:
- Update `src/services/summary.ts` to call Cloud Function
- Add loading states in UI while summary is generated
- Show "Generating summary..." indicator

### Security:
- Store OpenAI API key in Firebase Functions config (not client)
- Validate user authentication in Cloud Function
- Implement request validation

---

## 2. Audio Processing Pipeline (Whisper Integration)

**Priority**: High  
**Estimated Time**: 6-8 hours

### Tasks:
- Set up Firebase Cloud Function for audio transcription
- Integrate OpenAI Whisper API (or self-hosted Whisper)
- Upload audio blob to Firebase Storage
- Process audio and return transcript
- Update note with transcript from server

### Files to Create:
- `functions/src/transcribe.ts` - Cloud Function for audio transcription
- Update `src/services/storage.ts` - Audio upload utility

### Integration Points:
- Modify `useRecorder` hook to upload audio after recording
- Show "Processing audio..." indicator
- Fallback to Web Speech API if server processing fails

### Considerations:
- Audio file size limits (Firebase Storage)
- Processing time (may need async processing with Cloud Tasks)
- Cost optimization (Whisper API pricing)

---

## 3. ML-Based Subject Detection

**Priority**: Medium  
**Estimated Time**: 4-6 hours

### Tasks:
- Create Firebase Cloud Function for subject classification
- Train or use pre-trained model for subject detection
- Options:
  - Fine-tune a small transformer model (BERT, DistilBERT)
  - Use OpenAI embeddings + classification
  - Use a simple Naive Bayes classifier with user's subjects
- Return subject with confidence score

### Files to Create:
- `functions/src/detectSubject.ts` - Cloud Function for subject detection
- Update `src/services/subjectDetector.ts` to call Cloud Function

### Integration Points:
- Replace keyword matching with ML-based detection
- Show confidence score in UI
- Allow user to confirm or change detected subject

---

## 4. Production Security Improvements

**Priority**: High  
**Estimated Time**: 2-4 hours

### Tasks:
- Review and tighten Firestore security rules
- Add Firebase Storage security rules for audio files
- Implement rate limiting for API calls
- Add input validation and sanitization
- Set up CORS policies
- Add request logging and monitoring

### Files to Update:
- `firebase/firestore.rules` - Enhanced security rules
- `firebase/storage.rules` - Storage security rules
- Add validation utilities in `src/lib/validation.ts`

### Security Checklist:
- [ ] Users can only access their own data
- [ ] Audio files are private to user
- [ ] API endpoints validate authentication
- [ ] Input sanitization prevents injection attacks
- [ ] Rate limiting prevents abuse

---

## 5. Mobile App Build (Capacitor)

**Priority**: Medium  
**Estimated Time**: 8-12 hours

### Tasks:
- Install and configure Capacitor
- Set up Android project
- Configure iOS project (if needed)
- Add native permissions for microphone
- Test recording on mobile devices
- Build and test APK

### Steps:
1. Install Capacitor: `npm install @capacitor/core @capacitor/cli`
2. Initialize: `npx cap init`
3. Add platforms: `npx cap add android`
4. Sync: `npx cap sync`
5. Build: `npx cap build android`
6. Update GitHub Actions workflow

### Files to Create:
- `capacitor.config.json` - Capacitor configuration
- Update `.github/workflows/build-android.yml`

### Considerations:
- Microphone permissions on Android/iOS
- File system access for audio storage
- Push notifications (future feature)
- App store submission process

---

## 6. Testing & Quality Assurance

**Priority**: High  
**Estimated Time**: 6-8 hours

### Tasks:
- Set up Jest and React Testing Library
- Write unit tests for hooks (`useRecorder`, `useSubjects`)
- Write integration tests for auth flow
- Write E2E tests for recording and note saving
- Add accessibility tests (axe-core)
- Set up test coverage reporting

### Files to Create:
- `src/__tests__/hooks/useRecorder.test.tsx`
- `src/__tests__/hooks/useSubjects.test.tsx`
- `src/__tests__/services/auth.test.ts`
- `src/__tests__/App.test.tsx`
- `jest.config.js`
- `.github/workflows/test.yml`

### Test Coverage Goals:
- Hooks: 80%+
- Services: 80%+
- Components: 70%+
- Overall: 75%+

---

## Additional Enhancements (Future)

1. **Real-time Collaboration**: Share notes with study groups
2. **Search Functionality**: Full-text search across notes
3. **Tags System**: Organize notes with custom tags
4. **Export Formats**: Markdown, DOCX, HTML
5. **Note Templates**: Pre-defined templates for different lecture types
6. **Voice Commands**: Control app with voice during recording
7. **Offline Support**: PWA with offline note storage
8. **Analytics Dashboard**: User insights and usage statistics
9. **AI Suggestions**: Smart suggestions for note improvements
10. **Integration with Calendar**: Link notes to calendar events

---

## Implementation Order Recommendation

1. **Week 1**: Server-side summarization + Production security
2. **Week 2**: Audio processing pipeline
3. **Week 3**: ML-based subject detection + Testing
4. **Week 4**: Mobile app build + Polish

---

## Notes

- All server-side code (Cloud Functions) should be in the `functions/` directory
- Keep API keys secure - never commit to repository
- Test thoroughly before deploying to production
- Monitor Firebase usage and costs
- Set up error tracking (Sentry) before production launch

