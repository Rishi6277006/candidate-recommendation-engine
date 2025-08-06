# AI Candidate Recommendation Engine - Frontend

A modern React frontend for the AI-powered candidate recommendation system.

## 🚀 Deployment on Vercel

### Quick Deploy
1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy from frontend directory:**
   ```bash
   cd frontend
   vercel
   ```

3. **Follow the prompts:**
   - Link to existing project or create new
   - Confirm deployment settings
   - Deploy!

### Manual Deploy
1. **Push to GitHub** (if not already done)
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Deploy!

## 🔧 Configuration

### API Configuration
- **Backend URL:** `https://candidate-recommendation-engine.onrender.com`
- **API Endpoints:** Automatically proxied through Vercel
- **CORS:** Handled by Vercel configuration

### Environment Variables
No environment variables needed - API URL is configured in `vercel.json`

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── Hero.js
│   │   ├── UploadSection.js
│   │   ├── ResultsSection.js
│   │   └── AnalyticsSection.js
│   ├── styles/
│   │   ├── App.css
│   │   └── index.css
│   ├── App.js
│   └── index.js
├── package.json
├── vercel.json
└── README.md
```

## 🎨 Features

- **Modern UI:** Glass-morphism design with animations
- **File Upload:** Drag-and-drop resume upload
- **Real-time Analysis:** TF-IDF embeddings and cosine similarity
- **Responsive Design:** Works on all devices
- **Professional UX:** Smooth animations and transitions

## 🔗 Links

- **Frontend:** [Vercel URL] (after deployment)
- **Backend:** https://candidate-recommendation-engine.onrender.com
- **GitHub:** https://github.com/Rishi6277006/candidate-recommendation-engine

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 📋 Assignment Requirements

✅ **All requirements met:**
- ✅ Accept job description (text input)
- ✅ Accept candidate resumes (file upload)
- ✅ Generate embeddings (TF-IDF)
- ✅ Compute cosine similarity
- ✅ Display top candidates with similarity scores
- ✅ AI-generated summary (bonus feature) 