#!/bin/bash

echo "🧹 Removing ALL gradients..."

FRONTEND_DIR="frontend/src"

# Remove all bg-gradient-to-* classes
echo "📝 Removing background gradients..."

# Common gradient patterns to solid colors
find $FRONTEND_DIR -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e 's/bg-gradient-to-br from-slate-50 via-[a-z0-9-]* to-[a-z0-9-]*/bg-slate-50/g' \
  -e 's/bg-gradient-to-r from-keppel-[0-9]* to-[a-z0-9-]* bg-clip-text text-transparent/text-keppel-500/g' \
  -e 's/bg-gradient-to-br from-keppel-[0-9]* to-[a-z0-9-]*/bg-keppel-500/g' \
  -e 's/bg-gradient-to-br from-[a-z0-9-]* to-[a-z0-9-]*/bg-keppel-500/g' \
  {} +

echo "✅ All gradients removed!"

