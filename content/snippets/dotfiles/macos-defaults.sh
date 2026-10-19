#!/usr/bin/env bash

# ============================================
# macOS System Preferences Configuration
# ============================================
# This script configures macOS system defaults for development.
# It's based on mathiasbynens/dotfiles with tak-bro's preferences.
#
# References:
# - https://github.com/mathiasbynens/dotfiles/blob/main/.macos
# - https://macos-defaults.com/

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

echo ""
echo "🔧 Configuring macOS System Preferences"
echo "========================================"
echo ""

# ============================================
# Close System Preferences
# ============================================
print_info "Closing System Preferences to prevent conflicts..."
osascript -e 'tell application "System Preferences" to quit'

# ============================================
# Request sudo access upfront
# ============================================
# 프롬프트는 /dev/tty 로 나간다. 열 수 없는 환경(cron·하네스·ssh without -t)에서는 sudo 가
# 무음으로 멈추거나 죽으므로 먼저 막는다 — install.sh request_sudo_upfront 와 같은 이유.
if ! sudo -n true 2>/dev/null && ! : >/dev/tty 2>/dev/null; then
    echo "✗ /dev/tty 를 열 수 없다 — sudo 암호를 받을 수 없다. 터미널에서 직접 실행할 것 (원격이면 ssh -t)" >&2
    exit 1
fi
print_info "🔑 sudo 암호를 묻는다 — 프롬프트가 안 보이면 그대로 암호를 입력하고 Enter"
sudo -v

# Keep sudo alive until script finishes
while true; do sudo -n true; sleep 60; kill -0 "$$" || exit; done 2>/dev/null &

# ============================================
# General UI/UX
# ============================================
print_info "Configuring General UI/UX..."

# Set Ask to keep changes when closing documents
defaults write -g NSCloseAlwaysConfirmsChanges -bool true

print_success "General UI/UX configured"

# ============================================
# Dock
# ============================================
print_info "Configuring Dock..."

# Automatically hide and show the Dock
defaults write com.apple.dock autohide -bool false

# Set Dock icon size
defaults write com.apple.dock tilesize -int 40

# Don't show recent applications in Dock
defaults write com.apple.dock show-recents -bool false

# Speed up Dock auto-hide/show animation
defaults write com.apple.dock autohide-delay -float 0
defaults write com.apple.dock autohide-time-modifier -float 0.5

print_success "Dock configured"

# ============================================
# Finder
# ============================================
print_info "Configuring Finder..."

# Show path bar
defaults write com.apple.finder ShowPathbar -bool true

# Show status bar
defaults write com.apple.finder ShowStatusBar -bool true

# Disable warning when changing file extension
defaults write com.apple.finder FXEnableExtensionChangeWarning -bool false

# Show hidden files
defaults write com.apple.finder AppleShowAllFiles -bool true

# Show all file extensions
defaults write -g AppleShowAllExtensions -bool true

# Use list view in all Finder windows by default
# Codes: `icnv` = Icon, `Nlsv` = List, `clmv` = Column, `glyv` = Gallery
defaults write com.apple.finder FXPreferredViewStyle -string "Nlsv"

# Keep folders on top when sorting by name
defaults write com.apple.finder _FXSortFoldersFirst -bool true

# Avoid creating .DS_Store files on network or USB volumes
defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool true
defaults write com.apple.desktopservices DSDontWriteUSBStores -bool true

print_success "Finder configured"

# ============================================
# Screenshots
# ============================================
print_info "Configuring Screenshots..."

# Save screenshots to ~/Pictures/Screenshots
mkdir -p "${HOME}/Pictures/Screenshots"
defaults write com.apple.screencapture location -string "${HOME}/Pictures/Screenshots"

# Save screenshots in PNG format (other options: BMP, GIF, JPG, PDF, TIFF)
defaults write com.apple.screencapture type -string "png"

# Disable shadow in screenshots
defaults write com.apple.screencapture disable-shadow -bool true

print_success "Screenshots configured"

# ============================================
# Keyboard & Input
# ============================================
print_info "Configuring Keyboard & Input..."

# Enable full keyboard access for all controls
# (e.g. enable Tab in modal dialogs)
defaults write -g AppleKeyboardUIMode -int 3

# Disable press-and-hold for keys in favor of key repeat
defaults write -g ApplePressAndHoldEnabled -bool false

# Set a blazingly fast keyboard repeat rate
defaults write -g KeyRepeat -int 2
defaults write -g InitialKeyRepeat -int 15

# Disable automatic capitalization
defaults write -g NSAutomaticCapitalizationEnabled -bool false

# Disable smart dashes
defaults write -g NSAutomaticDashSubstitutionEnabled -bool false

# Disable automatic period substitution
defaults write -g NSAutomaticPeriodSubstitutionEnabled -bool false

# Disable smart quotes
defaults write -g NSAutomaticQuoteSubstitutionEnabled -bool false

# Disable auto-correct
defaults write -g NSAutomaticSpellingCorrectionEnabled -bool false

# Disable Cmd+Ctrl+D Dictionary popup
defaults write com.apple.symbolichotkeys AppleSymbolicHotKeys -dict-add 70 '<dict><key>enabled</key><false/></dict>'

print_success "Keyboard & Input configured"

# ============================================
# Trackpad
# ============================================
print_info "Configuring Trackpad..."

# Enable tap to click for this user and for the login screen
defaults write com.apple.driver.AppleBluetoothMultitouch.trackpad Clicking -bool true
defaults -currentHost write -g com.apple.mouse.tapBehavior -int 1
defaults write -g com.apple.mouse.tapBehavior -int 1

# Enable three finger drag
defaults write com.apple.driver.AppleBluetoothMultitouch.trackpad TrackpadThreeFingerDrag -bool true
defaults write com.apple.AppleMultitouchTrackpad TrackpadThreeFingerDrag -bool true

print_success "Trackpad configured"

# ============================================
# Menu Bar
# ============================================
print_info "Configuring Menu Bar..."

# Show battery percentage in menu bar
defaults write com.apple.menuextra.battery ShowPercent -string "YES"

# Show Bluetooth in menu bar
defaults write com.apple.controlcenter "NSStatusItem Visible Bluetooth" -bool true

print_success "Menu Bar configured"

# ============================================
# Login Window
# ============================================
print_info "Configuring Login Window..."

# Hide "Other" user on login screen
sudo defaults write /Library/Preferences/com.apple.loginwindow SHOWOTHERUSERS_MANAGED -bool FALSE

print_success "Login Window configured"

# ============================================
# Special Keyboard Mappings
# ============================================
print_info "Configuring Special Keyboard Mappings..."

# Map ₩ (Won sign) to ` (Backtick) for Korean keyboards
if [ ! -f ~/Library/KeyBindings/DefaultkeyBinding.dict ]; then
    mkdir -p ~/Library/KeyBindings
    echo '{"₩" = ("insertText:", "`");}' > ~/Library/KeyBindings/DefaultkeyBinding.dict
    print_success "₩ → \` mapping configured (requires restart)"
else
    print_success "₩ → \` mapping already configured"
fi

# ============================================
# Mission Control
# ============================================
print_info "Configuring Mission Control..."

# Don't automatically rearrange Spaces based on most recent use
defaults write com.apple.dock mru-spaces -bool false

# Group windows by application in Mission Control
defaults write com.apple.dock expose-group-apps -bool true

print_success "Mission Control configured"

# ============================================
# Terminal
# ============================================
print_info "Configuring Terminal..."

# Only use UTF-8 in Terminal.app
defaults write com.apple.terminal StringEncodings -array 4

print_success "Terminal configured"

# ============================================
# Activity Monitor
# ============================================
print_info "Configuring Activity Monitor..."

# Show the main window when launching Activity Monitor
defaults write com.apple.ActivityMonitor OpenMainWindow -bool true

# Show all processes in Activity Monitor
defaults write com.apple.ActivityMonitor ShowCategory -int 0

# Sort Activity Monitor results by CPU usage
defaults write com.apple.ActivityMonitor SortColumn -string "CPUUsage"
defaults write com.apple.ActivityMonitor SortDirection -int 0

print_success "Activity Monitor configured"

# ============================================
# Restart affected applications
# ============================================
print_info "Restarting affected applications..."

for app in "Activity Monitor" \
    "Dock" \
    "Finder" \
    "Safari" \
    "SystemUIServer"; do
    killall "${app}" &> /dev/null || true
done

print_success "Applications restarted"

echo ""
echo "✅ macOS configuration complete!"
echo ""
echo "Note: Some changes may require a full restart to take effect."
echo "      Specifically, the ₩ → \` keyboard mapping requires a restart."
echo ""
