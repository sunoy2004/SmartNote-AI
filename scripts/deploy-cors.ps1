# PowerShell script to deploy CORS configuration for Firebase Storage
# This allows localhost and production domains to upload files

Write-Host "🚀 Deploying CORS configuration for Firebase Storage..." -ForegroundColor Cyan

# Get the storage bucket name from Firebase config
$BUCKET_NAME = "smartnote-ai-3d0fd.appspot.com"

# Check if gsutil is available
$gsutilPath = Get-Command gsutil -ErrorAction SilentlyContinue

if ($gsutilPath) {
    Write-Host "✅ Found gsutil. Deploying CORS rules..." -ForegroundColor Green
    gsutil cors set firebase/storage.cors.json "gs://$BUCKET_NAME"
    Write-Host "✅ CORS rules deployed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ gsutil not found. Please install Google Cloud SDK:" -ForegroundColor Red
    Write-Host "   https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternatively, you can deploy CORS rules manually:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://console.cloud.google.com/storage/browser/$BUCKET_NAME" -ForegroundColor Cyan
    Write-Host "2. Click on 'Configuration' tab" -ForegroundColor Cyan
    Write-Host "3. Scroll to 'CORS configuration'" -ForegroundColor Cyan
    Write-Host "4. Click 'Edit' and paste the contents of firebase/storage.cors.json" -ForegroundColor Cyan
    Write-Host "5. Click 'Save'" -ForegroundColor Cyan
}


