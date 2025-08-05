import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiTrendingUp, FiAward, FiBarChart } from 'react-icons/fi';
import './AnalyticsSection.css';

const AnalyticsSection = ({ analytics }) => {
  if (!analytics) return null;

  const metrics = [
    {
      icon: <FiUsers />,
      label: 'Total Candidates',
      value: analytics.total_candidates,
      color: '#667eea'
    },
    {
      icon: <FiTrendingUp />,
      label: 'Average Match Score',
      value: `${analytics.average_similarity.toFixed(1)}%`,
      color: '#764ba2'
    },
    {
      icon: <FiAward />,
      label: 'Top Match Score',
      value: `${analytics.max_similarity.toFixed(1)}%`,
      color: '#f093fb'
    },
    {
      icon: <FiBarChart />,
      label: 'Lowest Match Score',
      value: `${analytics.min_similarity.toFixed(1)}%`,
      color: '#4facfe'
    }
  ];

  return (
    <section className="analytics-section">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">📊 Key Performance Metrics</h2>
        
        <div className="metrics-grid">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              className="metric-card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="metric-icon" style={{ color: metric.color }}>
                {metric.icon}
              </div>
              <div className="metric-content">
                <h3 className="metric-value">{metric.value}</h3>
                <p className="metric-label">{metric.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="analytics-summary">
          <div className="summary-card">
            <h4>🎯 Analysis Summary</h4>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">Processing Time:</span>
                <span className="stat-value">~2-5 seconds</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Embedding Model:</span>
                <span className="stat-value">TF-IDF + Cosine Similarity</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Accuracy:</span>
                <span className="stat-value">High Precision</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AnalyticsSection; 