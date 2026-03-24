# HebrewLens - Manual File Download Guide

If you need to manually recreate the project structure, here are all the files:

## Project Structure
```
hebrewlens/
├── public/
│   └── favicon.svg
├── src/
│   ├── lib/
│   │   └── openai.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── .gitignore
├── index.html
├── package.json
├── README.md
├── HEBREWLENS_CONTEXT.md
├── DEPLOYMENT_GUIDE.md
├── eslint.config.js
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

## Key Files Content

### package.json
```json
{
  "name": "hebrewlens",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "html-to-image": "^1.11.11",
    "lucide-react": "^0.344.0",
    "openai": "^4.28.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2"
  }
}
```

### .env (create this file)
```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

All other file contents are available in the current Bolt project.