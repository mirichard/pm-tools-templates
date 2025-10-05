#!/bin/bash

# Start MCP Servers for PM Tools Templates
# This script starts both the filesystem and GitHub MCP servers

set -e  # Exit on any error

echo "🚀 Starting MCP Servers for PM Tools Templates..."
echo "=================================================="

# Check if required tools are installed
echo "📋 Checking prerequisites..."

# Check if npx is available
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx is not installed. Please install Node.js first."
    exit 1
fi

# Check if docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if docker is running
if ! docker info &> /dev/null; then
    echo "❌ Error: Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Start Filesystem MCP Server
echo "📁 Starting Filesystem MCP Server..."
PROJECT_PATH="/Users/michael/pm-tools-templates"

# Check if directory exists
if [ ! -d "$PROJECT_PATH" ]; then
    echo "❌ Error: Project directory $PROJECT_PATH does not exist"
    exit 1
fi

# Kill any existing filesystem server
pkill -f "@modelcontextprotocol/server-filesystem" || true

# Start filesystem server in background
echo "   Command: npx -y @modelcontextprotocol/server-filesystem $PROJECT_PATH"
nohup npx -y @modelcontextprotocol/server-filesystem "$PROJECT_PATH" > filesystem-mcp.log 2>&1 &
FILESYSTEM_PID=$!

echo "   ✅ Filesystem server started with PID: $FILESYSTEM_PID"
echo "   📄 Logs: filesystem-mcp.log"

# Wait a moment for server to initialize
sleep 2

# Verify filesystem server is running
if ps -p $FILESYSTEM_PID > /dev/null; then
    echo "   ✅ Filesystem server is running successfully"
else
    echo "   ❌ Filesystem server failed to start"
    exit 1
fi

echo ""

# Start GitHub MCP Server
echo "🐙 Starting GitHub MCP Server..."

# Check if GITHUB_PERSONAL_ACCESS_TOKEN is set
if [ -z "$GITHUB_PERSONAL_ACCESS_TOKEN" ]; then
    echo "⚠️  Warning: GITHUB_PERSONAL_ACCESS_TOKEN environment variable is not set"
    echo "   You'll need to set this in your Warp MCP configuration"
    echo "   Example: export GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here"
fi

# Start GitHub server in background
echo "   Command: docker run -d --name github-mcp-server -e GITHUB_PERSONAL_ACCESS_TOKEN ghcr.io/github/github-mcp-server"

# Remove any existing container
docker rm -f github-mcp-server 2>/dev/null || true

# Start new container
CONTAINER_ID=$(docker run -d --name github-mcp-server -e GITHUB_PERSONAL_ACCESS_TOKEN ghcr.io/github/github-mcp-server)

echo "   ✅ GitHub server started with container ID: ${CONTAINER_ID:0:12}"

# Wait a moment for container to initialize
sleep 2

# Verify GitHub server is running
if docker ps -q -f name=github-mcp-server | grep -q .; then
    echo "   ✅ GitHub server is running successfully"
else
    echo "   ❌ GitHub server failed to start"
    docker logs github-mcp-server
    exit 1
fi

echo ""
echo "🎉 All MCP servers started successfully!"
echo "======================================"
echo ""
echo "📊 Server Status:"
echo "   Filesystem Server: PID $FILESYSTEM_PID"
echo "   GitHub Server: Container github-mcp-server"
echo ""
echo "🔍 Verification Commands:"
echo "   ps aux | grep '@modelcontextprotocol/server-filesystem'"
echo "   docker ps | grep 'github-mcp-server'"
echo ""
echo "📄 Logs:"
echo "   Filesystem: tail -f filesystem-mcp.log"
echo "   GitHub: docker logs -f github-mcp-server"
echo ""
echo "🛑 To stop servers: ./stop-mcp-servers.sh"
echo ""
echo "✅ Ready for Warp MCP configuration!"