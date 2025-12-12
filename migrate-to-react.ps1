# ============================================
# OMS Vue to React Migration Script
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  OMS Vue to React Migration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Backup package.json
Write-Host "[1/8] Backing up package.json..." -ForegroundColor Yellow
Copy-Item package.json package.json.vue.backup -Force
Write-Host "  ✓ Backup created" -ForegroundColor Green
Write-Host ""

# Step 2: Remove Vue files
Write-Host "[2/8] Removing Vue-specific files..." -ForegroundColor Yellow
$vueFiles = @(
    "src/App.vue",
    "src/main.ts",
    "src/env.d.ts",
    "auto-imports.d.ts",
    "components.d.ts"
)
foreach ($file in $vueFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✓ Removed $file" -ForegroundColor Green
    }
}
Write-Host ""

# Step 3: Remove node_modules and lock file
Write-Host "[3/8] Cleaning dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force node_modules
    Write-Host "  ✓ Removed node_modules" -ForegroundColor Green
}
if (Test-Path "pnpm-lock.yaml") {
    Remove-Item pnpm-lock.yaml -Force
    Write-Host "  ✓ Removed pnpm-lock.yaml" -ForegroundColor Green
}
Write-Host ""

# Step 4: Create new package.json
Write-Host "[4/8] Creating React package.json..." -ForegroundColor Yellow
$packageJson = @"
{
  "name": "oms-react",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "engines": {
    "node": ">=16.0.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "@tanstack/react-query": "^5.20.0",
    "axios": "^1.8.4",
    "zustand": "^4.5.0",
    "date-fns": "^4.1.0",
    "dayjs": "^1.11.13",
    "lodash-es": "^4.17.21",
    "nanoid": "^5.1.5",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1",
    "class-variance-authority": "^0.7.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.4",
    "lucide-react": "^0.344.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.56",
    "@types/react-dom": "^18.2.19",
    "@types/node": "^20.17.25",
    "@types/lodash-es": "^4.17.12",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.1.4",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.35",
    "autoprefixer": "^10.4.17",
    "@typescript-eslint/eslint-plugin": "^7.0.2",
    "@typescript-eslint/parser": "^7.0.2",
    "eslint": "^8.56.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5"
  }
}
"@
Set-Content -Path package.json -Value $packageJson -Encoding UTF8
Write-Host "  ✓ package.json created" -ForegroundColor Green
Write-Host ""

# Step 5: Update vite.config.ts
Write-Host "[5/8] Creating React vite.config.ts..." -ForegroundColor Yellow
$viteConfig = @"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [react()],
  server: {
    port: 3002
  }
})
"@
Set-Content -Path vite.config.ts -Value $viteConfig -Encoding UTF8
Write-Host "  ✓ vite.config.ts updated" -ForegroundColor Green
Write-Host ""

# Step 6: Update tsconfig.json
Write-Host "[6/8] Creating React tsconfig.json..." -ForegroundColor Yellow
$tsConfig = @"
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
"@
Set-Content -Path tsconfig.json -Value $tsConfig -Encoding UTF8
Write-Host "  ✓ tsconfig.json updated" -ForegroundColor Green
Write-Host ""

# Step 7: Create Tailwind config
Write-Host "[7/8] Creating Tailwind CSS config..." -ForegroundColor Yellow
$tailwindConfig = @"
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Item Brand Colors
        brand: {
          purple: '#6B46C1',
          orange: '#F97316',
        },
        // Shadcn Colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Satoshi', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
"@
Set-Content -Path tailwind.config.js -Value $tailwindConfig -Encoding UTF8
Write-Host "  ✓ tailwind.config.js created" -ForegroundColor Green
Write-Host ""

# Step 8: Create PostCSS config
$postcssConfig = @"
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
"@
Set-Content -Path postcss.config.js -Value $postcssConfig -Encoding UTF8
Write-Host "  ✓ postcss.config.js created" -ForegroundColor Green
Write-Host ""

Write-Host "[8/8] Migration preparation complete!" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Run: pnpm install" -ForegroundColor White
Write-Host "2. Wait for React project structure creation" -ForegroundColor White
Write-Host "3. Run: pnpm dev (will start on port 3002)" -ForegroundColor White
Write-Host ""
Write-Host "Vue version is still available on port 3001" -ForegroundColor Green
Write-Host ""
