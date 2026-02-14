#!/bin/bash

# Portfolio Server Manager Script
# This script helps manage your portfolio server

echo "================================================"
echo "Portfolio Server Manager"
echo "================================================"
echo ""

# Function to check if port 3000 is in use
check_port() {
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to kill process on port 3000
kill_port() {
    echo "🔍 Checking for processes on port 3000..."
    if check_port; then
        echo "⚠️  Port 3000 is in use. Killing process..."
        lsof -ti:3000 | xargs kill -9 2>/dev/null
        sleep 1
        if check_port; then
            echo "❌ Failed to kill process. Try manually."
            exit 1
        else
            echo "✅ Port 3000 is now free!"
        fi
    else
        echo "✅ Port 3000 is already free!"
    fi
}

# Function to start server
start_server() {
    echo ""
    echo "🚀 Starting portfolio server..."
    cd /Users/manas/IdeaProjects/MyDeveloperProfile
    npm start
}

# Main script
case "${1:-start}" in
    start)
        kill_port
        start_server
        ;;
    stop)
        echo "🛑 Stopping portfolio server..."
        kill_port
        echo "✅ Server stopped!"
        ;;
    restart)
        echo "🔄 Restarting portfolio server..."
        kill_port
        start_server
        ;;
    status)
        if check_port; then
            echo "✅ Server is running on port 3000"
            echo ""
            echo "Process details:"
            lsof -i :3000
        else
            echo "❌ Server is not running"
        fi
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        echo ""
        echo "Commands:"
        echo "  start   - Kill any process on port 3000 and start server"
        echo "  stop    - Stop the server"
        echo "  restart - Restart the server"
        echo "  status  - Check if server is running"
        exit 1
        ;;
esac

