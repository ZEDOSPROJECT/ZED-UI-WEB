#!/bin/bash
#
# Multi-threaded Backend Startup Script
# Supports multiple backend modes: Python Flask, PHP-FPM, or PHP built-in
#

BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$BACKEND_DIR/SERVER"
PORT=3031
HOST="0.0.0.0"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║          ZED-UI-WEB Backend Startup Manager               ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to start Python Flask backend (multi-threaded)
start_python_backend() {
    echo -e "${GREEN}[MODE]${NC} Starting Python Flask multi-threaded backend..."
    
    if ! command_exists python3; then
        echo -e "${RED}✗ Python3 not found!${NC}"
        return 1
    fi
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "$BACKEND_DIR/venv" ]; then
        echo -e "${YELLOW}⚠ Creating Python virtual environment...${NC}"
        python3 -m venv "$BACKEND_DIR/venv"
        echo -e "${GREEN}✓${NC} Virtual environment created"
    fi
    
    # Activate virtual environment and install dependencies
    source "$BACKEND_DIR/venv/bin/activate"
    
    # Check for required packages
    if ! python3 -c "import flask" 2>/dev/null; then
        echo -e "${YELLOW}⚠ Flask not installed. Installing dependencies...${NC}"
        pip install flask werkzeug
        echo -e "${GREEN}✓${NC} Dependencies installed"
    fi
    
    # Check for php-cgi
    if ! command_exists php-cgi; then
        echo -e "${YELLOW}⚠ php-cgi not found. PHP scripts will not work.${NC}"
        echo -e "${YELLOW}  Install with: sudo apt-get install php-cgi${NC}"
    fi
    
    cd "$BACKEND_DIR"
    python3 backSystem.py
}

# Function to start PHP-FPM backend (multi-process)
start_phpfpm_backend() {
    echo -e "${GREEN}[MODE]${NC} Starting PHP-FPM multi-process backend..."
    
    if ! command_exists php-fpm; then
        echo -e "${RED}✗ PHP-FPM not found!${NC}"
        echo -e "${YELLOW}  Install with: sudo apt-get install php-fpm${NC}"
        return 1
    fi
    
    if ! command_exists nginx; then
        echo -e "${RED}✗ Nginx not found!${NC}"
        echo -e "${YELLOW}  Install with: sudo apt-get install nginx${NC}"
        return 1
    fi
    
    # Generate Nginx configuration
    cat > "$BACKEND_DIR/nginx.conf" <<EOF
worker_processes auto;
daemon off;

events {
    worker_connections 1024;
    use epoll;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    sendfile on;
    keepalive_timeout 65;
    
    upstream php_backend {
        server unix:/var/run/php/php-fpm.sock;
    }
    
    server {
        listen $PORT;
        server_name $HOST;
        root $SERVER_DIR;
        index index.php index.html;
        
        add_header Access-Control-Allow-Origin *;
        
        location / {
            try_files \$uri \$uri/ /index.php?\$query_string;
        }
        
        location ~ \.php$ {
            fastcgi_pass php_backend;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
            include fastcgi_params;
        }
        
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|mp3|wav)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
EOF
    
    echo -e "${GREEN}✓${NC} Starting Nginx with PHP-FPM..."
    sudo nginx -c "$BACKEND_DIR/nginx.conf"
}

# Function to start PHP built-in server (original mode)
start_php_builtin() {
    echo -e "${GREEN}[MODE]${NC} Starting PHP built-in server (single-threaded)..."
    echo -e "${YELLOW}⚠ Note: This mode is single-threaded. Use Python or PHP-FPM for better performance.${NC}"
    
    if ! command_exists php; then
        echo -e "${RED}✗ PHP not found!${NC}"
        return 1
    fi
    
    cd "$BACKEND_DIR"
    php -S "$HOST:$PORT" -t SERVER/
}

# Main menu - você pode editar a ordem de prioridade aqui
echo ""
echo "Available backend modes:"
echo -e "${GREEN}1)${NC} Python Flask (Multi-threaded) - 10 concurrent workers"
echo -e "${GREEN}2)${NC} PHP-FPM + Nginx (Multi-process) - High performance"
echo -e "${GREEN}3)${NC} PHP Built-in (Single-threaded) - Original, 100% compatible"
echo ""

# Auto-select mode: Priority order can be changed below
# Command line argument can override
if [ -n "$1" ]; then
    MODE="$1"
else
    # Priority: Try Python Flask first, then PHP-FPM, then PHP built-in
    # Change the order below if you prefer a different mode
    if command_exists python3; then
        MODE="1"
        echo -e "${BLUE}🚀 Auto-selected: Python Flask (multi-threaded)${NC}"
    elif command_exists php-fpm && command_exists nginx; then
        MODE="2"
        echo -e "${BLUE}🚀 Auto-selected: PHP-FPM + Nginx${NC}"
    elif command_exists php; then
        MODE="3"
        echo -e "${BLUE}🚀 Auto-selected: PHP Built-in${NC}"
    else
        echo -e "${RED}❌ No suitable backend found!${NC}"
        echo -e "${YELLOW}Please install Python3, PHP-FPM, or PHP${NC}"
        exit 1
    fi
fi

echo ""

case "$MODE" in
    1)
        start_python_backend
        ;;
    2)
        start_phpfpm_backend
        ;;
    3)
        start_php_builtin
        ;;
    *)
        echo -e "${RED}Invalid mode selected${NC}"
        exit 1
        ;;
esac

EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
    echo -e "${RED}✗ Backend failed to start${NC}"
    exit $EXIT_CODE
fi
