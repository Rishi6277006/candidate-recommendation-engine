#!/usr/bin/env python3
"""
DUNA - AI Candidate Recommendation Engine
Flask Backend Runner

This script runs the Flask backend server for the DUNA application.
"""

import os
import sys
from app import app

def main():
    """Main function to run the Flask application"""
    
    # Set Flask environment
    os.environ['FLASK_ENV'] = 'production'
    
    # Configuration
    host = os.environ.get('HOST', '0.0.0.0')
    port = int(os.environ.get('PORT', 5001))  # Changed from 5000 to 5001
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    print("🚀 Starting AI Candidate Recommendation Engine")
    print(f"📍 Backend URL: http://{host}:{port}")
    print(f"🔧 Debug Mode: {debug}")
    print("📱 Frontend will be served from: http://localhost:3000")
    print("🔗 API will be available at: http://localhost:5001")
    print("\n" + "="*50)
    
    try:
        # Run the Flask application
        app.run(
            host=host,
            port=port,
            debug=debug,
            threaded=True
        )
    except KeyboardInterrupt:
        print("\n👋 Shutting down DUNA server...")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main() 