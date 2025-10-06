#!/usr/bin/env python3
"""
Multi-threaded Backend Server for ZED-UI-WEB
Supports concurrent PHP request handling with thread pool
"""

from flask import Flask, request, send_from_directory, Response
from werkzeug.serving import run_simple
from werkzeug.middleware.dispatcher import DispatcherMiddleware
import subprocess
import os
import sys
from pathlib import Path
import mimetypes
from concurrent.futures import ThreadPoolExecutor
import threading

# Configuration
SERVER_DIR = Path(__file__).parent / "SERVER"
HOST = "0.0.0.0"
PORT = 3031
MAX_WORKERS = 10  # Number of concurrent threads for PHP processing
DEBUG = False

app = Flask(__name__)

# Thread pool for PHP execution
php_executor = ThreadPoolExecutor(max_workers=MAX_WORKERS)

# Thread-safe counter for active requests
request_counter = threading.Lock()
active_requests = 0

def execute_php(php_file_path, query_string="", post_data=None, method="GET"):
    """
    Execute PHP script using CGI
    """
    global active_requests
    
    with request_counter:
        active_requests += 1
    
    try:
        # Try to find php-cgi
        php_cgi_cmd = 'php-cgi'
        
        # Check if php-cgi exists, fallback to php if not
        try:
            subprocess.run(['which', 'php-cgi'], capture_output=True, check=True)
        except subprocess.CalledProcessError:
            # php-cgi not found, try using php with CGI mode
            try:
                subprocess.run(['which', 'php'], capture_output=True, check=True)
                php_cgi_cmd = 'php'
            except subprocess.CalledProcessError:
                return b"HTTP/1.1 500 Internal Server Error\r\n\r\nPHP not available"
        
        env = os.environ.copy()
        
        # Remove PHPRC to avoid using the Windows-configured php.ini
        env.pop('PHPRC', None)
        
        # Build REQUEST_URI
        script_path = '/' + str(php_file_path.relative_to(SERVER_DIR))
        request_uri = script_path + ('?' + query_string if query_string else '')
        
        env.update({
            # Request info
            'REQUEST_METHOD': method,
            'REQUEST_URI': request_uri,
            'QUERY_STRING': query_string,
            
            # Script info
            'SCRIPT_FILENAME': str(php_file_path),
            'SCRIPT_NAME': script_path,
            'PATH_INFO': '',
            'PATH_TRANSLATED': str(php_file_path),
            'DOCUMENT_ROOT': str(SERVER_DIR),
            
            # Server info
            'SERVER_SOFTWARE': 'ZED-Backend/1.0',
            'SERVER_NAME': request.host.split(':')[0] if request and request.host else 'localhost',
            'SERVER_ADDR': '127.0.0.1',
            'SERVER_PORT': str(PORT),
            'SERVER_PROTOCOL': 'HTTP/1.1',
            'GATEWAY_INTERFACE': 'CGI/1.1',
            
            # Client info
            'REMOTE_ADDR': request.remote_addr if request else '127.0.0.1',
            'REMOTE_HOST': request.remote_addr if request else '127.0.0.1',
            'REMOTE_PORT': str(request.environ.get('REMOTE_PORT', '0')) if request else '0',
            
            # Content info
            'CONTENT_TYPE': request.content_type if request and request.content_type else '',
            'CONTENT_LENGTH': str(len(post_data)) if post_data else '0',
            
            # PHP specific
            'REDIRECT_STATUS': '200',
            'PHP_SELF': script_path,
        })
        
        # Add all request headers
        if request:
            # Add HTTP headers from request
            for key, value in request.headers:
                env_key = f'HTTP_{key.upper().replace("-", "_")}'
                env[env_key] = value
            
            # Ensure critical headers exist
            if 'HTTP_HOST' not in env:
                env['HTTP_HOST'] = request.host if request.host else f'localhost:{PORT}'
        else:
            # Set default headers if no request context
            env['HTTP_HOST'] = f'localhost:{PORT}'
            env['HTTP_USER_AGENT'] = 'ZED-Backend-Client/1.0'
            env['HTTP_ACCEPT'] = '*/*'
            env['HTTP_CONNECTION'] = 'close'
        
        # Execute PHP with necessary extensions enabled
        # Use php-cgi for proper CGI mode, fallback to php if needed
        if php_cgi_cmd == 'php-cgi':
            # Enable common extensions needed by ZED-UI-WEB
            cmd = [
                php_cgi_cmd, 
                '-n',  # No php.ini
                '-d', 'extension=fileinfo',  # For mime_content_type()
                '-d', 'extension=json',      # For json_encode/decode
                '-d', 'display_errors=0', 
                '-d', 'log_errors=0',
                '-d', 'error_reporting=0',
                '-d', 'memory_limit=256M',
                '-d', 'max_execution_time=30',
                '-d', 'file_uploads=On',
                '-d', 'upload_max_filesize=100M',
                '-d', 'post_max_size=100M',
                '-d', 'allow_url_fopen=On',
                '-d', 'session.save_path=/tmp'
            ]
        else:
            # Using regular php, not ideal but workable
            cmd = [
                php_cgi_cmd, 
                '-d', 'display_errors=0', 
                '-d', 'log_errors=0',
                '-d', 'error_reporting=0'
            ]
        
        result = subprocess.run(
            cmd,
            env=env,
            input=post_data,
            capture_output=True,
            timeout=30,
            cwd=str(SERVER_DIR)
        )
        
        return result.stdout
    
    except subprocess.TimeoutExpired:
        return b"HTTP/1.1 504 Gateway Timeout\r\n\r\nPHP script execution timeout"
    except Exception as e:
        return f"HTTP/1.1 500 Internal Server Error\r\n\r\nError: {str(e)}".encode()
    finally:
        with request_counter:
            active_requests -= 1


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """
    Serve static files or execute PHP scripts
    """
    # Default to index.html if path is empty or ends with /
    if not path or path.endswith('/'):
        path = os.path.join(path, 'index.html')
    
    file_path = SERVER_DIR / path
    
    # Security: prevent directory traversal
    try:
        file_path = file_path.resolve()
        SERVER_DIR.resolve()
        if not str(file_path).startswith(str(SERVER_DIR.resolve())):
            return "Access Denied", 403
    except:
        return "Invalid path", 400
    
    # Check if file exists
    if not file_path.exists():
        # Try index.php if directory
        if file_path.is_dir():
            php_index = file_path / 'index.php'
            html_index = file_path / 'index.html'
            
            if php_index.exists():
                file_path = php_index
            elif html_index.exists():
                file_path = html_index
            else:
                return "Not Found", 404
        else:
            return "Not Found", 404
    
    # Handle PHP files
    if file_path.suffix == '.php':
        query_string = request.query_string.decode('utf-8')
        post_data = request.get_data() if request.method == 'POST' else None
        
        # Execute PHP in thread pool
        future = php_executor.submit(
            execute_php,
            file_path,
            query_string,
            post_data,
            request.method
        )
        
        output = future.result()
        
        # Parse CGI output
        if b'\r\n\r\n' in output:
            headers_raw, body = output.split(b'\r\n\r\n', 1)
        elif b'\n\n' in output:
            headers_raw, body = output.split(b'\n\n', 1)
        else:
            return Response(output, mimetype='text/html')
        
        # Parse headers
        headers = {}
        for line in headers_raw.decode('utf-8', errors='ignore').split('\n'):
            if ':' in line:
                key, value = line.split(':', 1)
                headers[key.strip()] = value.strip()
        
        # Get content type from headers or default
        content_type = headers.get('Content-Type', 
                                   headers.get('Content-type', 'text/html'))
        
        return Response(body, mimetype=content_type, headers=headers)
    
    # Serve static files
    try:
        directory = str(file_path.parent)
        filename = file_path.name
        
        # Determine mimetype
        mimetype = mimetypes.guess_type(filename)[0]
        
        return send_from_directory(directory, filename, mimetype=mimetype)
    except Exception as e:
        return f"Error serving file: {str(e)}", 500


@app.route('/status')
def status():
    """
    Server status endpoint
    """
    return {
        'status': 'running',
        'active_requests': active_requests,
        'max_workers': MAX_WORKERS,
        'version': '1.0.0'
    }


def main():
    """
    Start the multi-threaded server
    """
    print(f"""
╔═══════════════════════════════════════════════════════════╗
║          ZED-UI-WEB Multi-threaded Backend Server         ║
╠═══════════════════════════════════════════════════════════╣
║  Server Directory: {str(SERVER_DIR):<40} ║
║  Host: {HOST:<50} ║
║  Port: {PORT:<50} ║
║  Max Workers: {MAX_WORKERS:<46} ║
║  Thread Pool: Active                                      ║
╚═══════════════════════════════════════════════════════════╝
    """)
    
    # Check if php-cgi is available
    php_available = False
    try:
        subprocess.run(['php-cgi', '-v'], capture_output=True, check=True)
        print("✓ php-cgi found")
        php_available = True
    except (subprocess.CalledProcessError, FileNotFoundError):
        try:
            subprocess.run(['php', '-v'], capture_output=True, check=True)
            print("✓ php found (using php instead of php-cgi)")
            php_available = True
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("✗ Warning: PHP not found. PHP scripts will not work.")
            print("  Install with: sudo apt-get install php-cgi")
    
    print(f"\n🚀 Server starting on http://{HOST}:{PORT}")
    print(f"📊 Status endpoint: http://{HOST}:{PORT}/status")
    print(f"⚙️  Using {MAX_WORKERS} worker threads\n")
    
    # Run with threaded mode enabled
    run_simple(
        HOST,
        PORT,
        app,
        use_reloader=DEBUG,
        use_debugger=DEBUG,
        threaded=True,  # Enable multi-threading
        processes=1
    )


if __name__ == '__main__':
    main()
