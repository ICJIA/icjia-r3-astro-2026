#!/bin/bash

# Configure mise to recognize .nvmrc files
mise settings add idiomatic_version_file_enable_tools node

# Run the build
yarn generate
