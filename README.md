# SmartNote AI - AI-Powered Note Taking App

Transform lectures into organized, AI-generated notes automatically.

SmartNote AI is an innovative note-taking application that leverages artificial intelligence to automatically generate structured notes from audio recordings. With real-time transcription, subject detection, and smart summarization, it revolutionizes how students and professionals capture and organize information.

## 🌟 Key Features

### 🎙️ Real-Time Voice Recording
- Record lectures, meetings, or any audio content
- Live transcription as you speak
- Browser-based recording with no external dependencies

### 🤖 AI-Powered Note Generation
- Automatic note creation from transcribed content
- Smart summarization for quick review
- Subject detection and categorization

### 📚 Organized Note Management
- Categorize notes by detected subjects
- Searchable note library
- Export options (PDF, Text, Markdown)

### 🎨 Beautiful UI/UX
- Clean, modern interface with dark/light theme support
- Responsive design for all devices
- Intuitive navigation and organization

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Modern web browser (Chrome, Edge, Safari recommended)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd SmartNote-AI-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Firebase configuration
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:8080`

## 🧠 AI Features

### Automatic Speech Recognition (ASR)
The app uses the Web Speech API for real-time transcription. For enhanced accuracy, we're developing custom ASR models (see `ml_models/` directory).

### Subject Detection
Our AI analyzes content to automatically detect and categorize subjects, making it easy to organize your notes.

### Smart Summarization
Generate concise summaries of your notes for quick review and studying.

## 🛠️ Custom ML Models

This project includes custom machine learning models for enhanced functionality:

- **Custom ASR Model**: CNN + Bi-LSTM architecture for speech recognition
- **Custom NLP Model**: Transformer-based summarization
- **API Server**: Python Flask server for model inference

See `ml_models/INTEGRATION_GUIDE.md` for detailed integration instructions.

### Training Your Own Models

1. Prepare your dataset
2. Train the models:
   ```bash
   cd ml_models/asr
   python train_asr.py
   
   cd ../nlp
   python train_nlp.py
   ```
3. Start the API server:
   ```bash
   npm run ml-server
   ```

## 📁 Project Structure

```
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # Business logic and API integrations
│   ├── lib/            # Utility functions
│   └── firebase/       # Firebase configuration
├── ml_models/          # Custom ML models and API server
├── public/             # Static assets
└── docs/               # Documentation
```

## 🎨 UI/UX Features

### Theme Support
- Light and dark themes
- System preference detection
- Smooth theme transitions

### Responsive Design
- Works on mobile, tablet, and desktop
- Adaptive layouts for different screen sizes
- Touch-friendly interface

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run ml-server` - Start ML API server

### Technologies Used

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: React Hooks, Context API
- **Routing**: React Router
- **Backend**: Firebase (Auth, Firestore)
- **AI/ML**: Custom PyTorch models (ASR, NLP)

## 📱 Features Roadmap

- [x] Real-time voice recording
- [x] Live transcription
- [x] AI note generation
- [x] Subject detection
- [x] Dark/light theme
- [ ] Offline support
- [ ] Mobile app (React Native)
- [ ] Advanced AI features
- [ ] Collaboration tools

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- shadcn/ui for beautiful UI components
- Vite for fast development
- Firebase for backend services
- PyTorch for ML model development

---

<p align="center">
  Made with ❤️ for students and professionals everywhere
</p>