import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiBriefcase, FiCode } from 'react-icons/fi';
import './ResultsSection.css';

const ResultsSection = ({ results }) => {
  const [expandedCandidate, setExpandedCandidate] = useState(null);
  const [sortBy, setSortBy] = useState('similarity');
  const [filterThreshold, setFilterThreshold] = useState(0);

  const toggleCandidate = (id) => {
    setExpandedCandidate(expandedCandidate === id ? null : id);
  };

  const getSortedResults = () => {
    let sorted = [...results];
    
    switch (sortBy) {
      case 'similarity':
        sorted.sort((a, b) => b.similarity - a.similarity);
        break;
      case 'name':
        sorted.sort((a, b) => a.filename.localeCompare(b.filename));
        break;
      case 'rank':
        sorted.sort((a, b) => a.rank - b.rank);
        break;
      default:
        break;
    }

    return sorted.filter(candidate => candidate.similarity_percentage >= filterThreshold);
  };

  const getSimilarityColor = (percentage) => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    if (percentage >= 40) return '#ef4444';
    return '#6b7280';
  };

  const getSimilarityBadge = (percentage) => {
    if (percentage >= 80) return '🌟 Excellent Match';
    if (percentage >= 60) return '✅ Strong Match';
    if (percentage >= 40) return '🤔 Moderate Match';
    return '⚠️ Limited Match';
  };

  const sortedResults = getSortedResults();

  return (
    <section className="results-section">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="results-header">
          <h2 className="section-title">📋 Individual Candidate Analysis</h2>
          
          <div className="results-controls">
            <div className="control-group">
              <label htmlFor="sort-select">Sort by:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="control-select"
              >
                <option value="similarity">Similarity Score</option>
                <option value="name">Filename</option>
                <option value="rank">Rank</option>
              </select>
            </div>
            
            <div className="control-group">
              <label htmlFor="threshold-slider">Min Score: {filterThreshold}%</label>
              <input
                id="threshold-slider"
                type="range"
                min="0"
                max="100"
                value={filterThreshold}
                onChange={(e) => setFilterThreshold(parseInt(e.target.value))}
                className="control-slider"
              />
            </div>
          </div>
        </div>

        <div className="results-grid">
          <AnimatePresence>
            {sortedResults.map((candidate, index) => (
              <motion.div
                key={candidate.id}
                className="candidate-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                layout
              >
                <div className="candidate-header">
                  <div className="candidate-rank">
                    <span className="rank-number">#{candidate.rank}</span>
                  </div>
                  
                  <div className="candidate-info">
                    <h3 className="candidate-name">{candidate.filename}</h3>
                    <div className="candidate-meta">
                      <span className="experience-level">
                        <FiBriefcase /> {candidate.experience_level}
                      </span>
                      {candidate.found_skills.length > 0 && (
                        <span className="skills-count">
                          <FiCode /> {candidate.found_skills.length} skills
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="candidate-score">
                    <div 
                      className="similarity-badge"
                      style={{ 
                        backgroundColor: getSimilarityColor(candidate.similarity_percentage),
                        color: 'white'
                      }}
                    >
                      {candidate.similarity_percentage.toFixed(1)}%
                    </div>
                    <div className="similarity-label">
                      {getSimilarityBadge(candidate.similarity_percentage)}
                    </div>
                  </div>
                  
                  <button
                    className="expand-btn"
                    onClick={() => toggleCandidate(candidate.id)}
                    aria-label="Toggle candidate details"
                  >
                    {expandedCandidate === candidate.id ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                </div>

                <AnimatePresence>
                  {expandedCandidate === candidate.id && (
                    <motion.div
                      className="candidate-details"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="detail-section">
                        <h4>🤖 AI Summary</h4>
                        <p className="ai-summary">{candidate.summary}</p>
                      </div>
                      
                      {candidate.found_skills.length > 0 && (
                        <div className="detail-section">
                          <h4>🛠️ Key Skills Detected</h4>
                          <div className="skills-grid">
                            {candidate.found_skills.map((skill, skillIndex) => (
                              <span key={skillIndex} className="skill-tag">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="detail-section">
                        <h4>📄 Resume Preview</h4>
                        <div className="resume-preview">
                          <pre className="resume-text">
                            {candidate.resume_text.substring(0, 500)}
                            {candidate.resume_text.length > 500 && '...'}
                          </pre>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {sortedResults.length === 0 && (
          <div className="no-results">
            <p>No candidates match the current filter criteria.</p>
            <p>Try lowering the minimum score threshold.</p>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default ResultsSection; 