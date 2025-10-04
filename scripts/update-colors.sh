#!/bin/bash

# Script to update color scheme across all frontend files
# From: Indigo/Blue/Slate → To: Keppel/Turquoise/Ash Gray

echo "🎨 Updating color scheme..."

# Define the frontend directory
FRONTEND_DIR="frontend/src"

# Primary colors: indigo → keppel
echo "📝 Updating primary colors (indigo → keppel)..."
find $FRONTEND_DIR -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e 's/indigo-600/keppel-400/g' \
  -e 's/indigo-700/keppel-500/g' \
  -e 's/indigo-500/keppel-300/g' \
  -e 's/indigo-100/keppel-50/g' \
  -e 's/indigo-50/keppel-50/g' \
  -e 's/from-indigo-600/from-keppel-400/g' \
  -e 's/to-indigo-600/to-keppel-400/g' \
  -e 's/from-indigo-500/from-keppel-300/g' \
  -e 's/to-indigo-500/to-keppel-300/g' \
  -e 's/text-indigo-600/text-keppel-400/g' \
  -e 's/text-indigo-700/text-keppel-500/g' \
  -e 's/bg-indigo-600/bg-keppel-400/g' \
  -e 's/bg-indigo-700/bg-keppel-500/g' \
  -e 's/bg-indigo-100/bg-keppel-50/g' \
  -e 's/bg-indigo-50/bg-keppel-50/g' \
  -e 's/border-indigo-600/border-keppel-400/g' \
  -e 's/border-indigo-200/border-keppel-100/g' \
  -e 's/hover:bg-indigo-700/hover:bg-keppel-500/g' \
  -e 's/hover:text-indigo-600/hover:text-keppel-400/g' \
  {} +

# Secondary/accent colors: blue → turquoise
echo "📝 Updating secondary colors (blue → turquoise)..."
find $FRONTEND_DIR -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e 's/blue-600/turquoise-400/g' \
  -e 's/blue-50/turquoise-50/g' \
  -e 's/to-blue-600/to-turquoise-400/g' \
  -e 's/via-blue-50/via-turquoise-50/g' \
  {} +

# Purple → cambridge-blue
echo "📝 Updating purple → cambridge-blue..."
find $FRONTEND_DIR -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e 's/purple-600/cambridge-blue-400/g' \
  -e 's/purple-700/cambridge-blue-500/g' \
  -e 's/to-purple-600/to-cambridge-blue-400/g' \
  {} +

# Neutrals: slate → davys-gray and ash-gray
echo "📝 Updating neutrals (slate → davys-gray/ash-gray)..."
find $FRONTEND_DIR -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e 's/slate-900/davys-gray-800/g' \
  -e 's/slate-800/davys-gray-700/g' \
  -e 's/slate-700/davys-gray-600/g' \
  -e 's/slate-600/davys-gray-500/g' \
  -e 's/slate-500/davys-gray-400/g' \
  -e 's/slate-400/ash-gray-600/g' \
  -e 's/slate-300/ash-gray-500/g' \
  -e 's/slate-200/ash-gray-300/g' \
  -e 's/slate-100/ash-gray-200/g' \
  -e 's/slate-50/ash-gray-50/g' \
  -e 's/from-slate-50/from-ash-gray-50/g' \
  {} +

# Success colors: green → turquoise
echo "📝 Updating success colors (green → turquoise)..."
find $FRONTEND_DIR -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e 's/green-600/turquoise-500/g' \
  -e 's/green-700/turquoise-600/g' \
  -e 's/green-500/turquoise-400/g' \
  -e 's/green-300/turquoise-200/g' \
  -e 's/green-200/turquoise-100/g' \
  -e 's/green-100/turquoise-50/g' \
  -e 's/green-50/turquoise-50/g' \
  -e 's/from-green-500/from-turquoise-400/g' \
  -e 's/to-teal-500/to-turquoise-400/g' \
  -e 's/from-emerald-500/from-turquoise-400/g' \
  {} +

echo "✅ Color scheme updated successfully!"
echo "🔄 The dev server will auto-reload with new colors"

