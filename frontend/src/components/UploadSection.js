import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FiUpload, FiX } from 'react-icons/fi';
import './UploadSection.css';

const UploadSection = ({ onFileUpload, uploadedFiles }) => {
  const onDrop = useCallback((acceptedFiles) => {
    onFileUpload(acceptedFiles);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: true
  });

  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    onFileUpload(newFiles);
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('docx')) return '📝';
    if (fileType.includes('txt')) return '📃';
    return '📁';
  };

  return (
    <div className="upload-section">
      <div className="card">
        <h2>📄 Resume Upload</h2>
        <p className="section-description">
          Upload candidate resumes for AI-powered analysis
        </p>

        <div
          {...getRootProps()}
          className={`upload-area ${isDragActive ? 'drag-active' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="upload-content">
            <FiUpload className="upload-icon" />
            <h3>Drop files here or click to browse</h3>
            <p>Supports PDF, DOCX, and TXT files</p>
            <p className="upload-hint">Drag and drop multiple files for batch processing</p>
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <motion.div 
            className="uploaded-files"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4>Uploaded Files ({uploadedFiles.length})</h4>
            <div className="file-list">
              {uploadedFiles.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  className="file-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="file-info">
                    <span className="file-icon">
                      {getFileIcon(file.type)}
                    </span>
                    <div className="file-details">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                  <button
                    className="remove-file-btn"
                    onClick={() => removeFile(index)}
                    aria-label={`Remove ${file.name}`}
                  >
                    <FiX />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="upload-summary">
            <div className="summary-item">
              <span className="summary-label">Total Files:</span>
              <span className="summary-value">{uploadedFiles.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Size:</span>
              <span className="summary-value">
                {(uploadedFiles.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSection; 