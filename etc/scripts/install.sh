#!/bin/bash

echo ""
echo "######################"
echo "#  Install Pinboard  #"
echo "######################"
echo ""

# Run some check to see if the prerequisites are installed
node --version > /dev/null 2>&1 || { echo >&2 "Installation aborted: Node not installed"; exit 1; }
bower --version > /dev/null 2>&1 || { echo >&2 "Installation aborted: Bower not installed"; exit 2; }

# Install Bower packages
echo "Installing Bower packages..."
bower install

# Install Node packages
echo "Installing Node packages..."
npm install -d

# Run Pinboard
echo "Starting Pinboard..."
node app.js | bunyan
