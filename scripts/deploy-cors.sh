#!/bin/bash

# Script to deploy CORS configuration for Firebase Storage
# This allows localhost and production domains to upload files

echo "🚀 Deploying CORS configuration for Firebase Storage..."

# Get the storage bucket name from Firebase config
BUCKET_NAME="smartnote-ai-3d0fd.appspot.com"

# Deploy CORS rules using gsutil
if command -v gsutil &> /dev/null; then
  gsutil cors set firebase/storage.cors.json gs://${BUCKET_NAME}
  echo "✅ CORS rules deployed successfully!"
else
  echo "❌ gsutil not found. Please install Google Cloud SDK:"
  echo "   https://cloud.google.com/sdk/docs/install"
  echo ""
  echo "Alternatively, you can deploy CORS rules manually:"
  echo "1. Go to: https://console.cloud.google.com/storage/browser/${BUCKET_NAME}"
  echo "2. Click on 'Configuration' tab"
  echo "3. Scroll to 'CORS configuration'"
  echo "4. Click 'Edit' and paste the contents of firebase/storage.cors.json"
  echo "5. Click 'Save'"
fi


