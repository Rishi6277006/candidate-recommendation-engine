import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import Header from './components/Header';
import Hero from './components/Hero';
import UploadSection from './components/UploadSection';
import ResultsSection from './components/ResultsSection';
import AnalyticsSection from './components/AnalyticsSection';
import './styles/App.css';

function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [results, setResults] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    if (uploadedFiles.length === 0) {
      setError('Please upload at least one resume');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert files to base64
      const filesData = await Promise.all(
        uploadedFiles.map(async (file) => {
          const base64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(file);
          });

          return {
            name: file.name,
            type: file.type,
            content: base64
          };
        })
      );

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription,
          files: filesData
        })
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.results);
        setAnalytics(data.analytics);
      } else {
        setError(data.error || 'An error occurred during analysis');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (files) => {
    setUploadedFiles(files);
    setError(null);
  };

  const handleJobDescriptionChange = (description) => {
    setJobDescription(description);
    setError(null);
  };

  return (
    <div className="App">
      <Header />
      
      <main>
        <Hero />
        
        <section className="main-content">
          <div className="container">
            <div className="content-grid">
              <motion.div 
                className="job-description-section"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="card">
                  <h2>🎯 Job Description</h2>
                  <p className="section-description">
                    Enter the complete job description to find the perfect candidates
                  </p>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => handleJobDescriptionChange(e.target.value)}
                    placeholder="✨ Paste the complete job description here...

📋 Include:
• Job requirements and qualifications
• Responsibilities and duties
• Required skills and technologies
• Experience level expectations
• Company culture and values

💡 The more detailed the description, the better the AI matching!"
                    className="job-description-textarea"
                    rows={12}
                  />
                </div>
              </motion.div>

              <motion.div 
                className="upload-section"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <UploadSection 
                  onFileUpload={handleFileUpload}
                  uploadedFiles={uploadedFiles}
                />
              </motion.div>
            </div>

            {error && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="card error-card">
                  <p>❌ {error}</p>
                </div>
              </motion.div>
            )}

            <motion.div 
              className="analyze-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <button 
                className="btn-primary analyze-btn"
                onClick={handleAnalyze}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Analyzing with AI...
                  </>
                ) : (
                  '🚀 Launch AI Analysis'
                )}
              </button>
            </motion.div>

            {results && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <AnalyticsSection analytics={analytics} />
                <ResultsSection results={results} />
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Analytics />
    </div>
  );
}

export default App; 