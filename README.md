# PeerPapers

Software engineering project

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# General Frontend start

1. Run npm install to install necesarry dependencies
2. Run npm run dev to run vite with react

# Directory Structure

- Src folder contains the whole sourcecode of the frontend
- modules contains:
  - components -> UI components that are reusable across the application.
  - contexts -> React Contexts used for state management across different components without prop drilling.
  - hooks -> Custom React hooks for encapsulating reusable logic and stateful functionality.
  - services -> Functions and modules for handling external interactions like API requests, data processing, and business logic.
- pages -> Contains all the React pages. Each page and module has its own subdirectory where you put the page/module and the corresponding CSS file
