#!/bin/bash

echo "🚀 Installing required dependencies for Zynvo optimizations..."

# Install React Query
echo "📦 Installing React Query..."
npm install @tanstack/react-query @tanstack/react-query-devtools

# Install Bundle Analyzer
echo "📦 Installing Bundle Analyzer..."
npm install --save-dev @next/bundle-analyzer

# Install Sharp for image optimization
echo "📦 Installing Sharp..."
npm install sharp

# Install Web Vitals
echo "📦 Installing Web Vitals..."
npm install web-vitals

echo "✅ All dependencies installed successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Run 'npm run type-check' to verify no TypeScript errors"
echo "2. Run 'npm run build' to test the optimized build"
echo "3. Run 'npm run analyze' to check bundle size"