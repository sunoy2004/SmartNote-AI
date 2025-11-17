# Analytics Integration

This document describes the analytics events and tracking strategy for SmartNote AI.

## Firebase Analytics Events

The following events should be tracked to understand user behavior:

### Authentication Events

- `signup_completed` - User successfully signed up
  - Parameters: `method` (email)
- `login_completed` - User successfully logged in
  - Parameters: `method` (email)
- `logout_completed` - User logged out

### Onboarding Events

- `onboarding_started` - User started subject setup
- `onboarding_subject_added` - User added a subject
  - Parameters: `subject_name`, `total_subjects`
- `onboarding_completed` - User completed subject setup
  - Parameters: `total_subjects`

### Recording Events

- `recording_started` - User started a recording session
- `recording_stopped` - User stopped recording
  - Parameters: `duration_seconds`, `transcript_length`
- `recording_saved` - User saved notes
  - Parameters: `note_id`, `subject`, `has_audio`

### Note Events

- `note_viewed` - User viewed a note detail page
  - Parameters: `note_id`, `subject`
- `note_exported` - User exported a note
  - Parameters: `note_id`, `export_format` (pdf, share, copy)
- `note_shared` - User shared a note
  - Parameters: `note_id`, `share_method`

### Subject Events

- `subject_added` - User added a new subject
  - Parameters: `subject_name`
- `subject_removed` - User removed a subject
  - Parameters: `subject_name`
- `subject_detected` - AI detected a subject
  - Parameters: `detected_subject`, `confidence`, `user_confirmed` (boolean)

### Summary Events

- `summary_generated` - Summary was generated
  - Parameters: `method` (client, server), `duration_ms`, `transcript_length`
- `summary_requested` - User requested a new summary
  - Parameters: `note_id`

## Implementation

### Placeholder Implementation

Create `src/services/analytics.ts`:

```typescript
import { getAnalytics, logEvent, Analytics } from "firebase/analytics";
import app from "@/firebase/config";

let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export const trackEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (analytics) {
    logEvent(analytics, eventName, parameters);
  }
};
```

### Usage Example

```typescript
import { trackEvent } from "@/services/analytics";

// Track recording start
trackEvent("recording_started");

// Track note save
trackEvent("recording_saved", {
  note_id: noteId,
  subject: detectedSubject,
  has_audio: !!audioRef,
});
```

## Error Logging

### Sentry Integration (Placeholder)

For production error tracking, integrate Sentry:

1. Install Sentry:

```bash
npm install @sentry/react
```

2. Initialize in `src/main.tsx`:

```typescript
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.REACT_APP_SENTRY_DSN,
    environment: import.meta.env.MODE,
  });
}
```

3. Track errors:

```typescript
import * as Sentry from "@sentry/react";

try {
  // Your code
} catch (error) {
  Sentry.captureException(error);
}
```

## Privacy Considerations

- Only track anonymous usage data
- Do not track personal information (transcript content, user names)
- Comply with GDPR/CCPA if applicable
- Provide opt-out mechanism in settings
- Document data retention policies

## Analytics Dashboard

View analytics in:
- **Firebase Console** > Analytics
- **Google Analytics** (if linked)

## Next Steps

1. Implement `analytics.ts` service
2. Add event tracking to key user actions
3. Set up custom dashboards in Firebase Analytics
4. Integrate Sentry for error tracking
5. Add privacy policy and opt-out mechanism

