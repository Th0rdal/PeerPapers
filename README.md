# PeerPapers

Software engineering project

# General Frontend start

1. Change into cd src/frontend
2. Run npm install to install necesarry dependencies
3. Run npm run dev to run vite with react (to start the frontend)

# Directory Structure

- Src folder contains the whole sourcecode of the frontend
- modules contains:
  - components -> UI components that are reusable across the application.
  - contexts -> React Contexts used for state management across different components without prop drilling.
  - hooks -> Custom React hooks for encapsulating reusable logic and stateful functionality.
  - services -> Functions and modules for handling external interactions like API requests, data processing, and business logic.
- pages -> Contains all the React pages. Each page and module has its own subdirectory where you put the page/module and the corresponding CSS file
