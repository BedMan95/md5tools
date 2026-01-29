#!/bin/bash
# Cleanup script - removes Bun-specific files after migration to Next.js

echo "Removing Bun configuration files..."
rm -f build.ts bunfig.toml bun-env.d.ts bun.lock

echo "Removing old Bun entry points and routing..."
rm -f src/index.ts src/routes.tsx src/frontend.tsx src/index.html src/App.tsx

echo "Removing logo files from src (already in public/)..."
rm -f src/logo.svg src/react.svg

echo "✅ Cleanup complete! Old Bun files have been removed."
echo "The project is now a pure Next.js application."
