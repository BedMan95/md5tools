# MD5 Tools - Next.js

A modern MD5 hashing and reverse lookup tool built with Next.js, React, and Tailwind CSS.

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Production Build

```bash
npm run build
npm start
```

## Features

- **Text to MD5**: Generate MD5 hashes from any text input
- **File to MD5**: Compute MD5 checksums for uploaded files
- **MD5 Reverse Lookup**: Attempt to crack MD5 hashes using public rainbow table services
- **Hash Comparison**: Compare two MD5 hashes for equality

## Technology Stack

- Next.js 15 (React framework with App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui Components

## Migration from Bun to Next.js

This project has been successfully refactored from a Bun-based setup to Next.js.

### Cleanup Old Bun Files

To remove Bun-specific files, run:

```bash
bash cleanup.sh
```

Or manually delete:
- `build.ts` - Bun build script
- `bunfig.toml` - Bun configuration
- `bun-env.d.ts` - Bun type definitions
- `bun.lock` - Bun lock file
- `src/index.ts` - Old Bun entry point
- `src/routes.tsx` - React Router (no longer needed)
- `src/frontend.tsx` - Old browser entry point
- `src/index.html` - Old HTML template
- `src/App.tsx` - Old App componen

## Deployment

Ready to deploy to Vercel, Netlify, or any Node.js hosting.

