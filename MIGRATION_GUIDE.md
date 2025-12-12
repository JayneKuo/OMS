# OMS Vue to React Migration Guide

## 🎯 Overview

This guide will help you migrate the OMS project from Vue 3 to React 18 while preserving the original Vue version.

## 📁 Project Structure

```
UNIS/
├── OMS项目/          # Original Vue version (port 3001)
└── OMS-React/        # New React version (port 3002) ← You are here
```

## 🚀 Migration Steps

### Step 1: Run Migration Script

In the `OMS-React` folder, run:

```powershell
powershell -ExecutionPolicy Bypass -File migrate-to-react.ps1
```

This will:
- ✅ Backup your package.json
- ✅ Remove Vue-specific files
- ✅ Create React package.json
- ✅ Update vite.config.ts for React
- ✅ Configure Tailwind CSS
- ✅ Set up TypeScript for React

### Step 2: Install Dependencies

```bash
pnpm install
```

### Step 3: Create React Structure

After installation completes, I (Kiro) will create:
- React components
- Page layouts
- Routing setup
- State management
- API layer
- Design system integration

### Step 4: Start Development

```bash
pnpm dev
```

React version will run on: `http://localhost:3002`

## 🎨 Design System

The React version will include:

### Colors
- **Brand Purple**: `#6B46C1`
- **Brand Orange**: `#F97316`
- **Shadcn/ui color system** (light/dark themes)

### Typography
- **Font**: Satoshi (Variable)
- **Weights**: 300, 400, 500, 700, 900

### Components
- shadcn/ui components
- Custom Item-branded components
- Responsive layouts

## 🔄 Version Switching

Both versions will have a switcher in the header:

- **Vue Version**: `http://localhost:3001`
- **React Version**: `http://localhost:3002`

## 📦 Tech Stack

### React Version
- ⚛️ React 18
- 📘 TypeScript
- ⚡ Vite
- 🎨 Tailwind CSS + shadcn/ui
- 🔄 React Router v6
- 🐻 Zustand (state management)
- 🔍 React Query (data fetching)
- 📅 date-fns / dayjs
- 🎯 Axios

### Vue Version (Preserved)
- 🖖 Vue 3
- 📘 TypeScript
- ⚡ Vite
- 🎨 Element Plus
- 🔄 Vue Router
- 🍍 Pinia

## 📝 Migration Checklist

After running the scripts, Kiro will help you:

- [ ] Create main App component
- [ ] Set up routing
- [ ] Create layout components
- [ ] Integrate design system
- [ ] Migrate first demo page (Order List)
- [ ] Add version switcher
- [ ] Configure API layer
- [ ] Set up state management

## 🎯 Next Steps

1. Run `migrate-to-react.ps1`
2. Run `pnpm install`
3. Let Kiro create the React structure
4. Start development with `pnpm dev`

## 💡 Tips

- Vue version remains untouched in `OMS项目` folder
- You can run both versions simultaneously
- Use Vue version as reference for business logic
- React version will be the production version

## 🆘 Need Help?

Ask Kiro to:
- Create specific components
- Migrate specific pages
- Fix configuration issues
- Add new features

---

**Ready to start?** Run the migration script in your `OMS-React` window!
