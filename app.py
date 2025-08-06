from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import PyPDF2
import docx
import io
import os
import json
import numpy as np
from typing import List, Tuple, Dict
import base64
import tempfile
import shutil

# TF-IDF embeddings and cosine similarity implementation
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

print("Using TF-IDF embeddings and cosine similarity for candidate analysis...")

app = Flask(__name__)
CORS(app)

# Basic error handling for app initialization
@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

@app.errorhandler(404)
def not_found_error(error):
    return jsonify({'error': 'Not found'}), 404

# Initialize TF-IDF vectorizer for embeddings
vectorizer = TfidfVectorizer(
    max_features=10000, # Increased to capture more vocabulary
    stop_words=None,    # Don't remove stop words as they can be important for matching
    ngram_range=(1, 2), # Include 1-2 word combinations (better for matching)
    min_df=1,           # Include words that appear at least once
    max_df=1.0,         # Allow all words (no filtering based on document frequency)
    lowercase=True,
    strip_accents='unicode'
)

# Text extraction functions
def extract_pdf_text(file_content):
    """Extract text from PDF file content"""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        return f"Error reading PDF: {str(e)}"

def extract_docx_text(file_content):
    """Extract text from DOCX file content"""
    try:
        doc = docx.Document(io.BytesIO(file_content))
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text.strip()
    except Exception as e:
        return f"Error reading DOCX: {str(e)}"

def extract_text_from_file(file_content, file_type):
    """Extract text from uploaded file content"""
    if file_type == "application/pdf":
        return extract_pdf_text(file_content)
    elif file_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return extract_docx_text(file_content)
    elif file_type == "text/plain":
        return file_content.decode("utf-8")
    else:
        return f"Unsupported file type: {file_type}"

# AI-powered candidate summary generation
def generate_candidate_summary(resume_text, job_description, similarity_score):
    """Generate AI summary for candidate"""
    # Extract key information from resume
    lines = resume_text.split('\n')
    name = lines[0] if lines else "Unknown Candidate"
    
    # Enhanced skills extraction
    skills_keywords = [
        'python', 'javascript', 'java', 'react', 'angular', 'vue', 'node.js', 'django', 'flask',
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'postgresql', 'mongodb', 'mysql',
        'machine learning', 'ai', 'artificial intelligence', 'tensorflow', 'pytorch', 'scikit-learn', 'git', 'ci/cd',
        'rest api', 'graphql', 'microservices', 'agile', 'scrum', 'devops',
        'openai', 'prompt engineering', 'nlp', 'natural language processing', 'llm', 'large language model',
        'salesforce', 'api', 'application programming interface', 'zapier', 'airtable', 'slack',
        'etl', 'data pipeline', 'tableau', 'power bi', 'sql', 'pandas', 'numpy', 'spark', 'airflow'
    ]
    
    # Experience level detection
    experience_indicators = [
        'senior', 'lead', 'principal', 'architect', 'manager', 'director', 'head of',
        'junior', 'entry', 'associate', 'intern', 'graduate', 'student'
    ]
    
    # Extract skills and experience level
    found_skills = []
    experience_level = "Mid-level"
    
    resume_lower = resume_text.lower()
    
    # Create a mapping for processed skills
    skill_mapping = {
        'artificial intelligence': 'AI',
        'machine learning': 'Machine Learning',
        'natural language processing': 'NLP',
        'large language model': 'LLM',
        'application programming interface': 'API',
        'amazon web services': 'AWS',
        'google cloud platform': 'Google Cloud',
        'microsoft azure': 'Azure'
    }
    
    for skill in skills_keywords:
        if skill in resume_lower:
            # Use mapping if available, otherwise title case
            display_skill = skill_mapping.get(skill, skill.title())
            if display_skill not in found_skills:
                found_skills.append(display_skill)
    
    for indicator in experience_indicators:
        if indicator in resume_lower:
            if indicator in ['senior', 'lead', 'principal', 'architect', 'manager', 'director', 'head of']:
                experience_level = "Senior"
            elif indicator in ['junior', 'entry', 'associate', 'intern', 'graduate', 'student']:
                experience_level = "Junior"
    
    # Find experience and skills sections
    experience_keywords = ['experience', 'worked', 'job', 'position', 'role']
    experience_section = ""
    skills_section = ""
    
    for line in lines:
        line_lower = line.lower()
        if any(keyword in line_lower for keyword in experience_keywords):
            experience_section += line + " "
        if any(keyword in line_lower for keyword in skills_keywords):
            skills_section += line + " "
    
    # Generate enhanced summary based on similarity score
    if similarity_score >= 0.8:
        strength = "excellent"
        recommendation = "highly recommended"
        emoji = "🌟"
    elif similarity_score >= 0.6:
        strength = "strong"
        recommendation = "recommended"
        emoji = "✅"
    elif similarity_score >= 0.4:
        strength = "moderate"
        recommendation = "consider"
        emoji = "🤔"
    else:
        strength = "limited"
        recommendation = "review carefully"
        emoji = "⚠️"
    
    # Enhanced summary with more details
    summary = f"{emoji} {name} shows {strength} alignment with the role requirements ({similarity_score*100:.1f}% match). "
    summary += f"Experience Level: {experience_level}. "
    
    if found_skills:
        # Show more skills for better visibility
        skills_to_show = found_skills[:8] if len(found_skills) > 8 else found_skills
        summary += f"Key Skills: {', '.join(skills_to_show)}"
        if len(found_skills) > 8:
            summary += f" (+{len(found_skills) - 8} more). "
        else:
            summary += ". "
    
    if experience_section:
        summary += f"Relevant Experience: {experience_section[:150]}... "
    
    summary += f"This candidate is {recommendation} for further consideration."
    
    return summary, found_skills, experience_level



# Main recommendation engine
class CandidateRecommendationEngine:
    def __init__(self):
        self.vectorizer = vectorizer
        
    def analyze_candidates(self, job_desc: str, resumes: List[Tuple[str, str]]) -> List[Dict]:
        """Analyze candidates and return ranked results using TF-IDF embeddings and cosine similarity"""
        if not job_desc.strip() or not resumes:
            return []
        
        # Prepare texts
        job_text = self._preprocess_text(job_desc.strip())
        resume_texts = [self._preprocess_text(resume[1]) for resume in resumes]
        
        # Generate TF-IDF embeddings
        all_texts = [job_text] + resume_texts
        tfidf_matrix = self.vectorizer.fit_transform(all_texts)
        
        # Compute cosine similarity between job and each resume
        job_embedding = tfidf_matrix[0:1]  # Job embedding
        resume_embeddings = tfidf_matrix[1:]  # Resume embeddings
        
        similarities = cosine_similarity(job_embedding, resume_embeddings)[0]
        
        # Create results
        results = []
        for idx, ((filename, resume_text), similarity) in enumerate(zip(resumes, similarities)):
            summary, found_skills, experience_level = generate_candidate_summary(resume_text, job_desc, similarity)
            
            results.append({
                'id': idx,
                'filename': filename,
                'similarity': float(similarity),
                'similarity_percentage': float(similarity) * 100,
                'resume_text': resume_text,
                'summary': summary,
                'found_skills': found_skills,
                'experience_level': experience_level,
                'rank': idx + 1
            })
        
        # Sort by similarity
        results.sort(key=lambda x: x['similarity'], reverse=True)
        
        # Update ranks
        for i, result in enumerate(results):
            result['rank'] = i + 1
        
        return results

    def _preprocess_text(self, text: str) -> str:
        """Preprocess text for better embedding quality"""
        # Convert to lowercase
        text = text.lower()
        
        # Replace common abbreviations and variations
        text = re.sub(r'\bai\b', 'artificial intelligence', text)
        text = re.sub(r'\bml\b', 'machine learning', text)
        text = re.sub(r'\bllm\b', 'large language model', text)
        text = re.sub(r'\bnlp\b', 'natural language processing', text)
        text = re.sub(r'\bapi\b', 'application programming interface', text)
        text = re.sub(r'\baws\b', 'amazon web services', text)
        text = re.sub(r'\bgcp\b', 'google cloud platform', text)
        text = re.sub(r'\bazure\b', 'microsoft azure', text)
        
        # Remove special characters but keep important ones
        text = re.sub(r'[^\w\s\-\.]', ' ', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text

# Initialize engine lazily
engine = None

def get_engine():
    global engine
    if engine is None:
        engine = CandidateRecommendationEngine()
    return engine

@app.route('/api/analyze', methods=['POST'])
def analyze_candidates():
    """API endpoint to analyze candidates"""
    try:
        data = request.get_json()
        job_description = data.get('jobDescription', '')
        files_data = data.get('files', [])
        
        if not job_description.strip():
            return jsonify({'error': 'Job description is required'}), 400
        
        if not files_data:
            return jsonify({'error': 'At least one resume file is required'}), 400
        
        # Process files
        resumes = []
        for file_data in files_data:
            filename = file_data.get('name', 'Unknown')
            file_type = file_data.get('type', '')
            file_content = base64.b64decode(file_data.get('content', ''))
            
            text = extract_text_from_file(file_content, file_type)
            if text and not text.startswith('Error'):
                resumes.append((filename, text))
        
        if not resumes:
            return jsonify({'error': 'No valid resume files found'}), 400
        
        # Analyze candidates
        results = get_engine().analyze_candidates(job_description, resumes)
        
        # Calculate analytics
        analytics = {
            'total_candidates': len(results),
            'average_similarity': float(np.mean([r['similarity_percentage'] for r in results])) if results else 0,
            'max_similarity': float(max([r['similarity_percentage'] for r in results])) if results else 0,
            'min_similarity': float(min([r['similarity_percentage'] for r in results])) if results else 0
        }
        
        return jsonify({
            'success': True,
            'results': results,
            'analytics': analytics
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'AI Candidate Recommendation Engine is running',
        'timestamp': '2025-08-05'
    })

@app.route('/health', methods=['GET'])
def simple_health():
    """Simple health check endpoint"""
    return jsonify({'status': 'ok'})

@app.route('/ping', methods=['GET'])
def ping():
    """Ping endpoint for health checks"""
    return 'pong'

@app.route('/')
def serve_frontend():
    """Serve the React frontend"""
    try:
        # Debug: Check if build directory exists
        import os
        build_path = 'frontend/build'
        if os.path.exists(build_path):
            print(f"Build directory exists: {build_path}")
            if os.path.exists(os.path.join(build_path, 'index.html')):
                print("index.html found")
                return send_from_directory(build_path, 'index.html')
            else:
                print("index.html not found")
        else:
            print(f"Build directory does not exist: {build_path}")
        
        # Fallback to simple HTML
    except Exception as e:
        # Fallback to a simple HTML page if build files are not available
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>AI Candidate Recommendation Engine</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 40px; }}
                .container {{ max-width: 800px; margin: 0 auto; }}
                .api-status {{ background: #f0f0f0; padding: 20px; border-radius: 8px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🎯 AI Candidate Recommendation Engine</h1>
                <p>The application is running successfully!</p>
                <div class="api-status">
                    <h3>API Endpoints:</h3>
                    <ul>
                        <li><strong>Health Check:</strong> <a href="/ping">/ping</a></li>
                        <li><strong>API Health:</strong> <a href="/api/health">/api/health</a></li>
                    </ul>
                </div>
                <p><em>Frontend build files are not available. The backend API is working correctly.</em></p>
            </div>
        </body>
        </html>
        """

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files"""
    try:
        return send_from_directory('frontend/build', path)
    except Exception as e:
        # Return a more helpful error for missing static files
        if path.startswith('static/'):
            return f"""
            <!DOCTYPE html>
            <html>
            <head><title>Static File Not Found</title></head>
            <body>
                <h1>Static file not found: {path}</h1>
                <p>The React build files may not be available in production.</p>
                <p><a href="/">← Back to Home</a></p>
            </body>
            </html>
            """, 404
        else:
            return jsonify({'error': 'File not found'}), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001) 