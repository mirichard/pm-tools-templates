#!/bin/bash

# Stop MCP Servers for PM Tools Templates
# This script stops both the filesystem and GitHub MCP servers

echo "🛑 Stopping MCP Servers for PM Tools Templates..."
echo "================================================"

# Stop Filesystem MCP Server
echo "📁 Stopping Filesystem MCP Server..."

# Find and kill filesystem server processes
FILESYSTEM_PIDS=$(pgrep -f "@modelcontextprotocol/server-filesystem" || true)

if [ -n "$FILESYSTEM_PIDS" ]; then
    echo "   Found filesystem server processes: $FILESYSTEM_PIDS"
    kill $FILESYSTEM_PIDS
    sleep 2
    
    # Force kill if still running
    REMAINING_PIDS=$(pgrep -f "@modelcontextprotocol/server-filesystem" || true)
    if [ -n "$REMAINING_PIDS" ]; then
        echo "   Force killing remaining processes: $REMAINING_PIDS"
        kill -9 $REMAINING_PIDS
    fi
    
    echo "   ✅ Filesystem server stopped"
else
    echo "   ℹ️  No filesystem server processes found"
fi

echo ""

# Stop GitHub MCP Server
echo "🐙 Stopping GitHub MCP Server..."

# Check if container exists and is running
if docker ps -q -f name=github-mcp-server | grep -q .; then
    echo "   Stopping container: github-mcp-server"
    docker stop github-mcp-server
    echo "   ✅ GitHub server container stopped"
else
    echo "   ℹ️  No running GitHub server container found"
fi

# Remove the container if it exists
if docker ps -aq -f name=github-mcp-server | grep -q .; then
    echo "   Removing container: github-mcp-server"
    docker rm github-mcp-server
    echo "   ✅ GitHub server container removed"
fi

echo ""

# Clean up any orphaned containers
echo "🧹 Cleaning up orphaned containers..."
ORPHANED=$(docker ps -aq -f ancestor=ghcr.io/github/github-mcp-server --filter status=exited)
if [ -n "$ORPHANED" ]; then
    echo "   Removing orphaned containers: $ORPHANED"
    docker rm $ORPHANED
    echo "   ✅ Orphaned containers removed"
else
    echo "   ℹ️  No orphaned containers found"
fi

echo ""

# Verify servers are stopped
echo "🔍 Verifying servers are stopped..."

# Check filesystem server
FILESYSTEM_CHECK=$(pgrep -f "@modelcontextprotocol/server-filesystem" || true)
if [ -z "$FILESYSTEM_CHECK" ]; then
    echo "   ✅ Filesystem server: Stopped"
else
    echo "   ❌ Filesystem server: Still running (PIDs: $FILESYSTEM_CHECK)"
fi

# Check GitHub server
GITHUB_CHECK=$(docker ps -q -f name=github-mcp-server || true)
if [ -z "$GITHUB_CHECK" ]; then
    echo "   ✅ GitHub server: Stopped"
else
    echo "   ❌ GitHub server: Still running (Container: $GITHUB_CHECK)"
fi

echo ""

# Clean up log files (optional)
read -p "🗑️  Remove log files? (filesystem-mcp.log) [y/N]: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -f "filesystem-mcp.log" ]; then
        rm filesystem-mcp.log
        echo "   ✅ Log files removed"
    else
        echo "   ℹ️  No log files found"
    fi
fi

echo ""
echo "🎉 All MCP servers stopped successfully!"
echo "======================================"
echo ""
echo "💡 To start servers again: ./start-mcp-servers.sh"