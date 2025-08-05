# 🎯 AI Candidate Recommendation Engine

A modern, AI-powered web application that intelligently matches job descriptions with candidate resumes using advanced NLP techniques and cosine similarity.

## ✨ Features

- **🤖 AI-Powered Matching**: Uses TF-IDF embeddings and cosine similarity for intelligent candidate-job matching
- **📄 Multi-Format Support**: Accepts PDF, DOCX, and plain text resume files
- **🎨 Modern UI**: Beautiful, responsive interface with glass-morphism design
- **📊 Detailed Analytics**: Comprehensive skills detection and experience level analysis
- **🚀 Production Ready**: Built with Flask backend and React frontend
- **📱 Mobile Responsive**: Works seamlessly on all devices

## 🏗️ Architecture

### Backend (Flask)
- **Framework**: Flask with CORS support
- **AI Engine**: TF-IDF vectorization with cosine similarity
- **File Processing**: PDF and DOCX text extraction
- **API**: RESTful endpoints for analysis

### Frontend (React)
- **Framework**: React with modern hooks
- **Styling**: CSS3 with glass-morphism effects
- **File Upload**: React Dropzone for drag-and-drop
- **Animations**: Framer Motion for smooth interactions

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rishi6277006/candidate-recommendation-engine.git
   cd candidate-recommendation-engine
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install and build frontend**
   ```bash
   cd frontend
   npm install
   npm run build
   cd ..
   ```

4. **Run the application**
   ```bash
   python run.py
   ```

5. **Access the application**
   - Open your browser and go to `http://localhost:5001`
   - The API will be available at `http://localhost:5001/api/analyze`

## 📖 Usage

1. **Enter Job Description**: Paste or type the job description in the text area
2. **Upload Resumes**: Drag and drop or select resume files (PDF, DOCX, TXT)
3. **Analyze**: Click "Analyze Candidates" to process the data
4. **View Results**: See ranked candidates with similarity scores and detailed analysis

## 🔧 API Endpoints

### POST `/api/analyze`
Analyzes candidates against a job description.

**Request Body:**
```json
{
  "jobDescription": "Software Engineer position...",
  "files": [
    {
      "name": "resume.pdf",
      "type": "application/pdf",
      "content": "base64_encoded_content"
    }
  ]
}
```

**Response:**
```json
{
  "results": [
    {
      "id": 0,
      "filename": "resume.pdf",
      "similarity": 0.85,
      "similarity_percentage": 85.0,
      "summary": "Candidate analysis...",
      "found_skills": ["Python", "React", "AWS"],
      "experience_level": "Senior",
      "rank": 1
    }
  ]
}
```

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

## 🛠️ Technology Stack

### Backend
- **Flask**: Web framework
- **scikit-learn**: TF-IDF vectorization and cosine similarity
- **PyPDF2**: PDF text extraction
- **python-docx**: DOCX text extraction
- **gunicorn**: Production WSGI server

### Frontend
- **React**: UI framework
- **React Dropzone**: File upload handling
- **React Icons**: Icon library
- **Framer Motion**: Animations
- **CSS3**: Styling with glass-morphism

## 📊 How It Works

1. **Text Preprocessing**: Job descriptions and resumes are cleaned and normalized
2. **TF-IDF Vectorization**: Documents are converted to TF-IDF vectors
3. **Cosine Similarity**: Similarity is computed between job and resume vectors
4. **Skills Detection**: Relevant skills are extracted and matched
5. **Ranking**: Candidates are ranked by similarity score
6. **Summary Generation**: AI-generated summaries explain the match

## 🚀 Deployment

### Railway (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Railway](https://railway.app)
3. Deploy automatically with the provided configuration

### Other Platforms
- **Render**: Use the provided `requirements.txt` and `Procfile`
- **Heroku**: Compatible with the existing configuration
- **Docker**: Use the provided `Dockerfile`

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email thakker834@gmail.com or create an issue in this repository.

---

**Built with ❤️ by Rishikesh Thakker** 