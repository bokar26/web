#!/bin/bash
echo "Killing all Next.js processes..."
pkill -9 -f "next dev" 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null
sleep 1

echo "Clearing caches..."
rm -rf .next node_modules/.cache .turbo

echo "Building..."
npm run build

echo "Starting dev server..."
npm run dev
