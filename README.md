# 🔔 Reminder App

---

## Table of Contents

* [About the App](#about-the-app)
* [Key Features](#key-features)
* [Technologies Used](#technologies-used)

---

## About the App

**Reminder App** is a convenient desktop application designed to help you stay organized and never miss an important event or task. It allows you to create various types of reminders for your daily life, ensuring you receive timely notifications.

---

## Key Features

* **Flexible Reminders:** Create reminders with or without specific dates and times.
* **Daily Reminders:** Set up daily notifications at a particular time.
* **Notification System:** Get reminders directly as desktop notifications.
* **Cross-Platform Updates:** Enjoy seamless updates for both macOS and Windows.
* **Secure Authentication:** Log in easily using your Google or Facebook accounts.

---

## Technologies Used

This application is built using a modern stack, combining desktop application development with a powerful web-based UI.

### Core Technologies

* **[Electron](https://www.electronjs.org/)**: The foundation of this desktop application. Electron allows for building cross-platform desktop apps using web technologies (HTML, CSS, JavaScript).
* **[React](https://react.dev/)**: Used for building the user interface. React's component-based architecture provides a highly efficient and maintainable front-end.
* **[TypeScript](https://www.typescriptlang.org/)**: Enhances code quality and maintainability by adding static typing to JavaScript. This helps catch errors during development.
* **[Vite](https://vitejs.dev/)**: A fast and lightweight build tool that significantly improves the development experience for React applications.

### UI & Styling

* **[@mui/material](https://mui.com/)** and **[@emotion/react](https://emotion.sh/)**: A popular React UI library (Material-UI) combined with a powerful CSS-in-JS library for styling components, ensuring a consistent and appealing user interface.
* **[@mui/icons-material](https://mui.com/material-ui/material-icons/)**: Provides a comprehensive set of Material Design icons to enhance the app's visual appeal.
* **[@mui/x-date-pickers](https://mui.com/x/react-date-pickers/)** and **[dayjs](https://day.js.org/)**: Used for efficient date and time handling, making it easy to set up reminders with specific schedules.

### Desktop Features & Utilities

* **[electron-updater](https://www.electron.build/auto-update)**: Facilitates automatic updates for macOS and Windows, ensuring users always have the latest version of the app.
* **[electron-store](https://github.com/sindresorhus/electron-store)**: Simplifies persistent data storage for the Electron application, like user preferences or reminder data.
* **[electron-log](https://github.com/megahertz/electron-log)**: Provides robust logging capabilities for the Electron application, essential for debugging and monitoring.

### Authentication & API

* **[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)**: Used for handling JSON Web Tokens, which are crucial for secure user authentication (Google, Facebook integration implies token-based authentication).
* **[axios](https://axios-http.com/)**: A popular promise-based HTTP client for making API requests, likely used for interacting with authentication services and any backend for storing reminder data.
* **[dotenv](https://github.com/motdotla/dotenv)**: Loads environment variables from a `.env` file, crucial for managing API keys and sensitive information securely.

### Development & Testing Tools

* **[electron-builder](https://www.electron.build/)**: A complete solution to package and build a ready-for-distribution Electron app for macOS, Windows, and Linux.
* **[npm-run-all](https://github.com/mysticatea/npm-run-all)**: A command-line tool that allows running multiple npm scripts in parallel or sequentially, simplifying the development workflow.
* **[eslint](https://eslint.org/)** and **[typescript-eslint](https://typescript-eslint.io/)**: Tools for static code analysis, ensuring code quality and consistency.
* **[vitest](https://vitest.dev/)**: A modern and fast unit testing framework.
* **[@playwright/test](https://playwright.dev/)**: Used for end-to-end testing of the application.
