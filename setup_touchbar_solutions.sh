#!/bin/bash

# TouchBar Flickering Solutions Setup Script
# Created: August 2, 2025

echo "=========================================="
echo "TouchBar Flickering Solutions Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_instruction() {
    echo -e "${BLUE}[INSTRUCTION]${NC} $1"
}

echo "Available solutions:"
echo "1. Fixed AppleScript App (Recommended)"
echo "2. LaunchAgent with Shell Script"
echo "3. Manual Commands"
echo "4. Third-Party Applications"
echo "5. Hardware Solutions"
echo ""

read -p "Which solution would you like to set up? (1-5): " choice

case $choice in
    1)
        echo ""
        print_status "Setting up Fixed AppleScript App..."
        
        # Check if app exists
        if [ -f "/Applications/touchbar_deflicker_fixed.app/Contents/MacOS/applet" ]; then
            print_status "Fixed app already installed at /Applications/touchbar_deflicker_fixed.app"
            
            # Test the app
            print_instruction "Testing the fixed app..."
            open /Applications/touchbar_deflicker_fixed.app
            sleep 3
            
            if pgrep -f "touchbar_deflicker_fixed" > /dev/null; then
                print_status "App is running successfully!"
                print_instruction "Monitor in Activity Monitor for 'applet' process"
            else
                print_error "App failed to start. Check Console for errors."
            fi
        else
            print_error "Fixed app not found. Please run the main fix first."
        fi
        ;;
        
    2)
        echo ""
        print_status "Setting up LaunchAgent solution..."
        
        # Copy LaunchAgent to user directory
        if [ -f "/Users/michael/pm-tools-templates/com.user.touchbar.deflicker.plist" ]; then
            cp "/Users/michael/pm-tools-templates/com.user.touchbar.deflicker.plist" ~/Library/LaunchAgents/
            print_status "LaunchAgent plist copied to ~/Library/LaunchAgents/"
            
            # Load the LaunchAgent
            launchctl load ~/Library/LaunchAgents/com.user.touchbar.deflicker.plist
            print_status "LaunchAgent loaded"
            
            # Test the script
            print_instruction "Testing the shell script..."
            /Users/michael/pm-tools-templates/touchbar_deflicker.sh
            
            if [ -f "/Users/michael/pm-tools-templates/touchbar_deflicker.log" ]; then
                print_status "Script executed. Check log:"
                tail -5 /Users/michael/pm-tools-templates/touchbar_deflicker.log
            fi
        else
            print_error "LaunchAgent files not found."
        fi
        ;;
        
    3)
        echo ""
        print_status "Manual Commands Solution"
        echo ""
        print_instruction "Use these commands manually when TouchBar flickers:"
        echo ""
        echo "# Kill TouchBarServer (will auto-restart):"
        echo "sudo pkill TouchBarServer"
        echo ""
        echo "# Alternative restart method:"
        echo "sudo launchctl kickstart -k system/com.apple.touchbard"
        echo ""
        echo "# Check if TouchBarServer is running:"
        echo "ps aux | grep TouchBarServer"
        echo ""
        print_instruction "You can create an alias in your shell profile:"
        echo "alias fix-touchbar='sudo pkill TouchBarServer'"
        ;;
        
    4)
        echo ""
        print_status "Third-Party Applications"
        echo ""
        print_instruction "Available options:"
        echo ""
        echo "1. BetterTouchTool (Popular, actively maintained)"
        echo "   - Comprehensive TouchBar customization"
        echo "   - May prevent flickering through custom controls"
        echo "   Install: brew install --cask bettertouchtool"
        echo ""
        echo "2. AVTouchBar (Audio visualizer)"
        echo "   - Shows audio visualization on TouchBar"
        echo "   - Might mask flickering issues"
        echo "   Install: brew install --cask avtouchbar"
        echo ""
        echo "3. TouchBar Simulator (for testing)"
        echo "   - Simulator for TouchBar"
        echo "   Install: brew install --cask touch-bar-simulator"
        echo ""
        read -p "Install BetterTouchTool? (y/n): " install_btt
        if [[ $install_btt == "y" || $install_btt == "Y" ]]; then
            print_status "Installing BetterTouchTool..."
            brew install --cask bettertouchtool
            if [ $? -eq 0 ]; then
                print_status "BetterTouchTool installed successfully!"
                print_instruction "Launch BetterTouchTool and configure TouchBar settings"
            else
                print_error "Failed to install BetterTouchTool"
            fi
        fi
        ;;
        
    5)
        echo ""
        print_status "Hardware Solutions"
        echo ""
        print_instruction "Try these hardware-level fixes:"
        echo ""
        echo "1. NVRAM Reset:"
        echo "   sudo nvram -c"
        echo "   (Then restart immediately)"
        echo ""
        echo "2. SMC Reset:"
        echo "   - Shut down MacBook Pro"
        echo "   - Hold Shift+Control+Option (left side) + Power for 10 seconds"
        echo "   - Release all keys and restart"
        echo ""
        echo "3. System Integrity Check:"
        echo "   sudo fsck -f /dev/disk1s1"
        echo "   sudo /usr/libexec/check_dyld_cache"
        echo ""
        read -p "Perform NVRAM reset now? (y/n): " reset_nvram
        if [[ $reset_nvram == "y" || $reset_nvram == "Y" ]]; then
            print_warning "This will reset NVRAM and require a restart!"
            read -p "Are you sure? (y/n): " confirm
            if [[ $confirm == "y" || $confirm == "Y" ]]; then
                print_status "Resetting NVRAM..."
                sudo nvram -c
                print_status "NVRAM reset complete. Please restart your computer now."
            fi
        fi
        ;;
        
    *)
        print_error "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "=========================================="
print_status "Setup complete!"
echo "=========================================="
echo ""
print_instruction "Next steps:"
echo "- Monitor TouchBar for flickering over the next few days"
echo "- Check logs in /Users/michael/pm-tools-templates/ for any issues"
echo "- Refer to TouchBar_Flickering_Solutions.md for detailed documentation"
echo ""
print_instruction "If issues persist, try a different solution or contact Apple Support"
