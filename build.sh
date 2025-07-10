#!/bin/bash

# Exit on any error
set -e

# Check if mise is available and configure it
if command -v mise &> /dev/null; then
    echo "Configuring mise to suppress warnings..."
    mise settings add idiomatic_version_file_enable_tools node 2>/dev/null || true
fi

# Ensure we're using the correct Node version
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Run the build
echo "Starting build process..."
yarn generate
