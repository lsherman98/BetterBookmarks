# Better Bookmarks v3

A visual bookmark management application built with React, TypeScript, and React Flow.

## Installation

1. Clone the repository (if you haven't already):

```bash
git clone <repository-url>
cd better-bookmarks-v3
```

2. Install dependencies:

```bash
pnpm install
```

## Running the Project

### Development Mode

To run the project in development mode with hot-reload:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Project Structure

- `src/` - Source code
  - `components/` - React components
    - `flow/` - React Flow related components (nodes, edges, toolbars)
    - `ui/` - Reusable UI components
  - `context/` - React context providers
  - `hooks/` - Custom React hooks
  - `lib/` - Utility functions and data
  - `store/` - State management (Zustand)
