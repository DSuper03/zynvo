#!/bin/bash

echo "🔧 Fixing TypeScript errors in Zynvo..."

# Step 1: Install missing dependencies
echo "📦 Installing missing dependencies..."
npm install @tanstack/react-query @tanstack/react-query-devtools sharp web-vitals
npm install --save-dev @next/bundle-analyzer

# Step 2: Replace problematic files with fixed versions
echo "🔄 Replacing problematic files..."

# Replace the optimized events page with the clean version
if [ -f "src/app/events/page.clean.tsx" ]; then
    cp src/app/events/page.clean.tsx src/app/events/page.optimized.tsx
    echo "✅ Fixed events page"
fi

# Step 3: Enable React Query after dependencies are installed
echo "🔄 Enabling React Query providers..."

# Update layout to use QueryProvider
sed -i 's|// import { QueryProvider } from|import { QueryProvider } from|g' src/app/layout.tsx
sed -i 's|<WarmupProvider>|<QueryProvider><WarmupProvider>|g' src/app/layout.tsx
sed -i 's|</WarmupProvider>|</WarmupProvider></QueryProvider>|g' src/app/layout.tsx

# Step 4: Update hooks to use React Query
echo "🔄 Updating hooks to use React Query..."
if [ -f "src/hooks/useEvents.ts" ]; then
    # Uncomment React Query imports
    sed -i 's|// import { useQuery|import { useQuery|g' src/hooks/useEvents.ts
    # Remove AxiosResponse import
    sed -i 's|, { AxiosResponse }||g' src/hooks/useEvents.ts
fi

# Step 5: Run type check
echo "🔍 Running TypeScript check..."
npm run type-check

if [ $? -eq 0 ]; then
    echo "✅ All TypeScript errors fixed!"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Run 'npm run build' to test the build"
    echo "2. Run 'npm run analyze' to check bundle size"
    echo "3. Run 'npm run dev' to test in development"
else
    echo "⚠️ Some TypeScript errors remain. Please check the output above."
fi