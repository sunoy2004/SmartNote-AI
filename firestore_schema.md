# Firestore Database Schema

## Collections Structure

```
users/
  {uid}/
    - name: string
    - email: string
    - createdAt: timestamp
    - subjects: array<string> (or subcollection)
    
    subjects/
      {subjectId}/
        - name: string
        - createdAt: timestamp
        - color?: string (optional)
    
    notes/
      {noteId}/
        - title: string
        - transcript: string
        - summary: string
        - subject: string
        - detectedSubjectConfidence: number (0-1)
        - createdAt: timestamp
        - durationMs: number
        - audioRef?: string (Firebase Storage path)
        - tags: array<string>
        - pendingServerSummary?: boolean (if using server-side LLM)
    
    transcripts/ (optional - if separating transcripts)
      {transcriptId}/
        - text: string
        - noteId: string
        - timestamp: timestamp
```

## Document Schemas

### users/{uid}

Main user document created on signup.

```typescript
{
  name: string;              // User's display name
  email: string;             // User's email
  createdAt: Timestamp;      // Account creation timestamp
  subjects: string[];        // Array of subject names (legacy, use subcollection)
}
```

### users/{uid}/subjects/{subjectId}

Subject subcollection (preferred over array for scalability).

```typescript
{
  name: string;              // Subject name (e.g., "Physics", "Mathematics")
  createdAt: Timestamp;      // When subject was added
  color?: string;            // Optional color for UI (e.g., "bg-primary")
}
```

### users/{uid}/notes/{noteId}

Note document created after recording session.

```typescript
{
  title: string;                    // Auto-generated or user-provided title
  transcript: string;                // Full transcription text
  summary: string;                   // AI-generated summary
  subject: string;                    // Detected or user-selected subject
  detectedSubjectConfidence: number;  // 0-1 confidence score
  createdAt: Timestamp;              // When note was created
  durationMs: number;                // Recording duration in milliseconds
  audioRef?: string;                  // Firebase Storage path to audio file
  tags: string[];                     // User or AI-generated tags
  pendingServerSummary?: boolean;     // Flag if server-side summary is pending
}
```

## Security Rules

See `firebase/firestore.rules` for complete security rules.

### High-Level Rules:

1. **Users Collection**: Users can read/write only their own document
2. **Subjects Subcollection**: Users can manage only their own subjects
3. **Notes Subcollection**: Users can create, read, update, delete only their own notes
4. **Public Access**: Denied by default

## Indexes Required

For optimal query performance, create these composite indexes in Firestore:

1. `users/{uid}/notes` collection:
   - `createdAt` (descending) - for recent notes queries
   - `subject` + `createdAt` (descending) - for subject-filtered queries

2. `users/{uid}/subjects` collection:
   - `createdAt` (ascending) - for ordered subject lists

## Data Migration Notes

- The `subjects` array in user document is kept for backward compatibility
- New implementations should use the `subjects` subcollection
- Migration script can be created to move array data to subcollection if needed

