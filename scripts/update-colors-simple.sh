#!/bin/bash

# Script to apply solid custom colors, keeping green and slate
# Primary: Keppel, Accent: Turquoise, Keep: Green success + Slate neutrals

echo "🎨 Applying solid color updates..."

FRONTEND_DIR="frontend/src"

# Step 1: Revert slate back (undo previous changes)
echo "📝 Reverting neutrals to slate..."
find $FRONTEND_DIR -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e 's/davys-gray-800/slate-900/g' \
  -e 's/davys-gray-700/slate-800/g' \
  -e 's/davys-gray-600/slate-700/g' \
  -e 's/davys-gray-500/slate-600/g' \
  -e 's/davys-gray-400/slate-500/g' \
  -e 's/ash-gray-600/slate-400/g' \
  -e 's/ash-gray-500/slate-300/g' \
  -e 's/ash-gray-400/slate-200/g' \
  -e 's/ash-gray-300/slate-200/g' \
  -e 's/ash-gray-200/slate-100/g' \
  -e 's/ash-gray-100/slate-50/g' \
  -e 's/ash-gray-50/slate-50/g' \
  -e 's/from-ash-gray-50/from-slate-50/g' \
  {} +

# Step 2: Revert green back (undo turquoise for success)
echo "📝 Reverting success states to green..."
find $FRONTEND_DIR -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e 's/turquoise-600/green-700/g' \
  -e 's/turquoise-500/green-600/g' \
  -e 's/turquoise-400/green-500/g' \
  -e 's/turquoise-300/green-300/g' \
  -e 's/turquoise-200/green-200/g' \
  -e 's/turquoise-100/green-100/g' \
  -e 's/turquoise-50/green-50/g' \
  -e 's/from-turquoise-400/from-green-500/g' \
  -e 's/to-turquoise-400/to-teal-500/g' \
  {} +

# Step 3: Remove gradients - replace with solid keppel
echo "📝 Removing gradients and applying solid colors..."
find $FRONTEND_DIR -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e 's/bg-gradient-to-br from-slate-50 via-turquoise-50 to-turquoise-50/bg-slate-50/g' \
  -e 's/bg-gradient-to-br from-keppel-400 to-turquoise-400/bg-keppel-500/g' \
  -e 's/bg-gradient-to-br from-keppel-400 to-cambridge-blue-400/bg-keppel-500/g' \
  -e 's/bg-gradient-to-br from-keppel-300 to-turquoise-400/bg-keppel-500/g' \
  -e 's/bg-gradient-to-r from-keppel-400 to-turquoise-400/text-keppel-500/g' \
  -e 's/bg-gradient-to-br from-turquoise-400 to-teal-500/bg-turquoise-500/g' \
  -e 's/bg-gradient-to-br from-keppel-50 to-turquoise-50/bg-keppel-50/g' \
  {} +

# Step 4: Make sure primary colors are keppel (solid)
echo "📝 Ensuring primary colors are keppel..."
# These should already be done, but making sure
find $FRONTEND_DIR -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e 's/indigo-600/keppel-500/g' \
  -e 's/indigo-700/keppel-600/g' \
  -e 's/indigo-500/keppel-400/g' \
  -e 's/indigo-100/keppel-50/g' \
  -e 's/hover:bg-indigo-700/hover:bg-keppel-600/g' \
  {} +

echo "✅ Solid color scheme applied!"
echo "   Primary: Keppel (teal)"
echo "   Success: Green"  
echo "   Neutrals: Slate"
echo "   No gradients ✓"

