#!/bin/bash

# Script to fix common TypeScript errors in the codebase

echo "Fixing TypeScript errors..."

# Fix unused React imports in files that use react-jsx
# Remove standalone "import React from 'react'" lines
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '/^import React from ['\''"]react['\''"]$/d' {} \;

# Remove React from imports that have other imports: "import React, { useState }" -> "import { useState }"
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's/import React, { /import { /g' {} \;

# Remove standalone React, from imports
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's/import React, /import /g' {} \;

echo "Fixed unused React imports"

# Add missing '!' or '?' to null checks for character
# This is a more complex fix that requires careful handling

echo "TypeScript error fixes completed"
echo "Please run 'npm run build' to check for remaining errors"
