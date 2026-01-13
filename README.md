# Agent Prompts

**Agent Prompts** is a powerful desktop application built with Electron, React, and TypeScript, designed to streamline the management of AI agent interactions. It provides a structured environment for organizing prompts into projects and tasks, while allowing developers to inject rich context from local files, markdown documents, and external URLs.

---

## What is it useful for?

In the rapidly evolving landscape of AI development, managing complex prompts often requires significant manual effort—especially when those prompts need to be grounded in specific local source code or architectural documentation. **Agent Prompts** simplifies this by:

- **Organizing Research & development**: Group related prompts into projects.
- **Context Management**: Easily attach local folder contents or specific files to provide the AI with the necessary background for better responses.
- **Standardizing Instruction sets**: Maintain a library of structured markdown documents (prompts) that include code snippets and architectural diagrams.
- **Workflow Efficiency**: Quick access to tasks and projects via a dedicated desktop interface with global availability through the system tray.

---

## Core Functionality

### 🚀 Project & Task Management

- **Hierarchical Organization**: Create and manage projects containing multiple specific tasks.
- **Full CRUD Support**: Create, update, and delete projects and tasks with real-time UI synchronization.
- **Data Persistence**: State is managed via a dedicated REST API with local caching for improved performance.

### 📁 Context Injection & File Handling

- **Local Folder Integration**: Select local directories to provide their file structure and contents as context for tasks.
- **File Uploads**: Support for uploading and managing files related to specific tasks.
- **Markdown Processing**: Specialized parser for markdown documents that handles standard text, code fences, and custom `architecture` blocks.

### 🔐 Secure Authentication

- **Social Login**: Integration with popular providers including **GitHub** and **Google**.
- **Session Persistence**: Secure token management for continuous access.

### 🖥️ Native Desktop Features

- **Auto-Updater**: Seamless updates via GitHub Releases integration.
- **System Tray**: Keep the application running in the background for quick access.
- **Native Notifications**: Real-time status updates for long-running tasks or updates.
- **Light/Dark Mode**: Customizable UI theme according to system preferences or user choice.

---

## Tech Stack

- **Framework**: Electron (Main & Renderer process)
- **Frontend**: React, Material UI (MUI), Vite, React Router
- **Language**: TypeScript (Strict typing across both processes)
- **State & Storage**: React Context, Electron-Store, REST API integration
- **Testing**: Playwright (E2E), Jest (Unit testing for Main and Renderer)
- **Styling**: Theme-driven CSS-in-JS (MUI `sx` prop and `styled` components)
