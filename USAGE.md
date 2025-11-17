# SmartNote AI - Local Development Setup

## Running the Application

To run the SmartNote AI application locally:

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   
   The application will be available at:
   - http://localhost:8082/ (or the next available port if 8080/8081 are in use)

3. **Alternative: Build and preview**:
   ```bash
   npm run build
   npm run preview
   ```
   
   The application will be available at:
   - http://localhost:4173/

## Testing the Recording Feature

To test the real-time recording feature:

1. Navigate to http://localhost:4173/test (or equivalent dev URL)
2. Click "Start Recording"
3. Allow microphone access when prompted by your browser
4. Speak into your microphone
5. You should see:
   - Live transcription appearing in the Transcript section
   - AI-generated notes appearing in the Notes section
   - Auto-generated summary in the Summary section
   - Detected subject with confidence percentage

## Main Application Features

The main application includes:

- **Landing Page**: http://localhost:4173/
- **Login/Signup**: http://localhost:4173/login and http://localhost:4173/signup
- **Dashboard**: http://localhost:4173/dashboard
- **Recording**: http://localhost:4173/record
- **Subjects Management**: http://localhost:4173/subjects
- **Settings**: http://localhost:4173/settings

## Browser Requirements

For the best experience, use:
- Google Chrome (recommended)
- Microsoft Edge
- Safari

Firefox and other browsers may have limited Web Speech API support.

## Troubleshooting

1. **Microphone not working**:
   - Ensure your browser has microphone permissions
   - Check that no other applications are using the microphone
   - Try refreshing the page

2. **No transcription appearing**:
   - Make sure you're using a supported browser
   - Check the browser console for errors (F12)
   - Ensure you're speaking clearly

3. **AI features not working**:
   - The app uses client-side algorithms for note generation
   - For best results, speak clearly and provide substantial content