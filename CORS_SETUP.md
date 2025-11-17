# Firebase Storage CORS Configuration

## Problem
When uploading audio files from `localhost:8080` (or other local ports), you may encounter CORS errors:
```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/...' 
from origin 'http://localhost:8080' has been blocked by CORS policy
```

## Solution
Deploy CORS rules to Firebase Storage to allow uploads from localhost and production domains.

## Method 1: Using gsutil (Recommended)

### Prerequisites
1. Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. Authenticate: `gcloud auth login`
3. Set your project: `gcloud config set project smartnote-ai-3d0fd`

### Deploy CORS Rules

**Windows (PowerShell):**
```powershell
.\scripts\deploy-cors.ps1
```

**Linux/Mac:**
```bash
chmod +x scripts/deploy-cors.sh
./scripts/deploy-cors.sh
```

**Or manually:**
```bash
gsutil cors set firebase/storage.cors.json gs://smartnote-ai-3d0fd.appspot.com
```

## Method 2: Using Google Cloud Console (Manual)

1. Go to [Google Cloud Console - Storage](https://console.cloud.google.com/storage/browser/smartnote-ai-3d0fd.appspot.com)
2. Click on your bucket: `smartnote-ai-3d0fd.appspot.com`
3. Click the **"Configuration"** tab
4. Scroll down to **"CORS configuration"**
5. Click **"Edit"**
6. Paste the contents of `firebase/storage.cors.json`:
   ```json
   [
     {
       "origin": ["http://localhost:8080", "http://localhost:5173", "http://localhost:3000", "https://smartnote-ai-3d0fd.web.app", "https://smartnote-ai-3d0fd.firebaseapp.com"],
       "method": ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
       "maxAgeSeconds": 3600,
       "responseHeader": ["Content-Type", "Authorization", "Content-Length", "User-Agent", "x-goog-resumable"]
     }
   ]
   ```
7. Click **"Save"**

## Verify CORS Configuration

After deploying, verify the CORS rules are active:
```bash
gsutil cors get gs://smartnote-ai-3d0fd.appspot.com
```

## Notes

- **Audio upload is optional**: The app will save notes even if audio upload fails due to CORS
- **Production domains**: Already included in CORS config (`smartnote-ai-3d0fd.web.app`, `smartnote-ai-3d0fd.firebaseapp.com`)
- **Local development**: Add your local port to `firebase/storage.cors.json` if using a different port

## Troubleshooting

If CORS errors persist:
1. Clear browser cache
2. Verify the bucket name matches: `smartnote-ai-3d0fd.appspot.com`
3. Check that CORS rules were deployed: `gsutil cors get gs://smartnote-ai-3d0fd.appspot.com`
4. Wait a few minutes for changes to propagate


