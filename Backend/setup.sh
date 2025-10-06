#!/bin/bash
#
# Quick Setup Script for ZED-UI-WEB Multi-threaded Backend
#

set -e

BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║     ZED-UI-WEB Backend Multi-threaded Setup               ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
else
    OS="unknown"
fi

echo -e "${BLUE}Detected OS: $OS${NC}\n"

# Install Python dependencies
echo -e "${GREEN}[1/4]${NC} Installing Python dependencies..."
if command_exists python3; then
    echo "  ✓ Python3 found"
    
    # Create virtual environment
    if [ ! -d "$BACKEND_DIR/venv" ]; then
        echo "  Creating Python virtual environment..."
        python3 -m venv "$BACKEND_DIR/venv"
        echo -e "  ${GREEN}✓${NC} Virtual environment created"
    fi
    
    # Activate and install dependencies
    source "$BACKEND_DIR/venv/bin/activate"
    echo "  Installing Flask and Werkzeug..."
    pip install -r "$BACKEND_DIR/requirements.txt"
    echo -e "  ${GREEN}✓${NC} Python dependencies installed in virtual environment"
    deactivate
else
    echo -e "${RED}  ✗ Python3 not found!${NC}"
    echo -e "${YELLOW}  Installing Python3...${NC}"
    
    if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
        sudo apt-get update
        sudo apt-get install -y python3 python3-venv
        python3 -m venv "$BACKEND_DIR/venv"
        source "$BACKEND_DIR/venv/bin/activate"
        pip install -r "$BACKEND_DIR/requirements.txt"
        deactivate
    else
        echo -e "${RED}  Please install Python3 manually${NC}"
        exit 1
    fi
fi

echo ""

# Install php-cgi
echo -e "${GREEN}[2/4]${NC} Installing PHP CGI..."
if command_exists php-cgi; then
    echo -e "  ${GREEN}✓${NC} php-cgi already installed"
else
    echo -e "${YELLOW}  Installing php-cgi...${NC}"
    
    if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
        sudo apt-get update
        sudo apt-get install -y php-cgi
        echo -e "  ${GREEN}✓${NC} php-cgi installed"
    else
        echo -e "${YELLOW}  ⚠ Please install php-cgi manually for your OS${NC}"
    fi
fi

echo ""

# Optional: PHP-FPM + Nginx
echo -e "${GREEN}[3/4]${NC} Optional: PHP-FPM + Nginx (for maximum performance)..."
read -p "  Install PHP-FPM + Nginx? (y/N): " install_phpfpm

if [ "$install_phpfpm" = "y" ] || [ "$install_phpfpm" = "Y" ]; then
    if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
        sudo apt-get update
        sudo apt-get install -y php-fpm nginx
        echo -e "  ${GREEN}✓${NC} PHP-FPM + Nginx installed"
    else
        echo -e "${YELLOW}  ⚠ Please install PHP-FPM and Nginx manually${NC}"
    fi
else
    echo "  Skipped"
fi

echo ""

# Make scripts executable
echo -e "${GREEN}[4/4]${NC} Setting permissions..."
chmod +x "$BACKEND_DIR/startBackend.sh"
chmod +x "$BACKEND_DIR/backSystem.py"
echo -e "  ${GREEN}✓${NC} Permissions set"

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                  Setup Complete! 🎉                        ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "To start the backend, run:"
echo -e "${BLUE}  cd Backend${NC}"
echo -e "${BLUE}  ./startBackend.sh${NC}"
echo ""
echo -e "Available modes:"
echo -e "  ${GREEN}1.${NC} Python Flask (Multi-threaded) - Recommended"
echo -e "  ${GREEN}2.${NC} PHP-FPM + Nginx (Multi-process) - Maximum performance"
echo -e "  ${GREEN}3.${NC} PHP Built-in (Single-threaded) - Development only"
echo ""
echo -e "The script will auto-select the best available mode."
echo ""
