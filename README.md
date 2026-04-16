# Dynamic Personal Page Builder

A production-level, highly interactive web application built with React and TypeScript. This project demonstrates advanced UI/UX patterns, state management with Zustand, and complex drag-and-drop interactions.

![Builder Preview](https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1200)

## 🚀 Features

- **Draggable Palette**: Drag components (Heading, Rich Text, Markdown, Image) from the sidebar into the canvas.
- **Vertical Reordering**: Smooth, animated reordering of blocks using `@dnd-kit`.
- **Inline Editing**:
  - Tiptap-powered Rich Text Editor.
  - Live Markdown preview.
  - Contenteditable Headings with level selection (H1-H4).
  - Image block with live URL updates.
- **State Management**:
  - Robust store using **Zustand**.
  - **Undo/Redo** functionality for all major actions.
  - **LocalStorage Persistence**: Auto-save and restore your page state.
- **Premium UI/UX**:
  - Responsive, modern design inspired by Notion and Webflow.
  - Dark/Light mode support.
  - Glassmorphic sidebars and headers.
  - Staggered animations using Framer Motion.
  - Interactive "add between" buttons and block controls.

## 🛠 Tech Stack

- **Framework**: React 18+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Drag & Drop**: `@dnd-kit`
- **Editors**: Tiptap, React-Markdown
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 🏗 Architecture

### Store-First Design
The application state is centralized in a `useStore` hook. Every action follows a predictable flow and is synchronized with the Undo stack and LocalStorage.

### Component Structure
- `/src/blocks`: Atomic block components.
- `/src/components`: UI layout components.
- `/src/store`: Centralized Zustand logic.
- `/src/types`: Shared TypeScript interfaces.

## 🚦 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

---

Developed with ❤️ as a demonstration of high-end frontend engineering.
