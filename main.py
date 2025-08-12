#!/usr/bin/env python3
"""
MINDORA.ART Flask Application
Serves static HTML/CSS/JS files through Flask for compatibility with gunicorn
"""

import os
from flask import Flask, send_from_directory, request

# Create Flask app
app = Flask(__name__)

@app.route('/')
def index():
    """Serve the main index.html file"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files (CSS, JS, HTML, images)"""
    try:
        # Check if file exists
        if os.path.exists(filename):
            return send_from_directory('.', filename)
        
        # For HTML files that don't exist, serve index.html (SPA routing)
        if filename.endswith('.html'):
            return send_from_directory('.', 'index.html')
            
        # For other missing files, return 404
        return f"File not found: {filename}", 404
        
    except Exception as e:
        return f"Error serving file: {str(e)}", 500

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors by serving index.html for SPA routing"""
    return send_from_directory('.', 'index.html')

@app.after_request
def after_request(response):
    """Add security headers to all responses"""
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    
    # Set proper MIME types based on file extension
    if request.path.endswith('.js'):
        response.headers['Content-Type'] = 'application/javascript'
    elif request.path.endswith('.css'):
        response.headers['Content-Type'] = 'text/css'
    elif request.path.endswith('.html'):
        response.headers['Content-Type'] = 'text/html; charset=utf-8'
    
    return response

if __name__ == '__main__':
    # Development server
    port = int(os.environ.get('PORT', 5000))
    print(f"🚀 Starting MINDORA.ART development server on port {port}")
    print("🎨 MINDORA.ART - Creative Platform Ready!")
    app.run(host='0.0.0.0', port=port, debug=True)