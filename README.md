# 🚀 TypeScript & Node.js Web Server – Dad Jokes API

A lightweight, strictly-typed Node.js web server built with TypeScript. The application acts as a backend service that fetches random jokes from the external **icanhazdadjoke API**, validates the response structure using TypeScript interfaces, and serves the data via a local HTTP server.

## 🛠️ Tech Stack & Tooling

* **Runtime:** [Node.js](https://nodejs.org/) (built-in `http` module)
* **Language:** [TypeScript 5.x](https://www.typescriptlang.org/) (configured with strict type-checking)
* **Development Runner:** [tsx](https://github.com/privatenumber/tsx) (esbuild-based runner with hot-reloading, chosen over legacy `ts-node-dev` for superior performance and modern Node.js compatibility)
* **HTTP Client:** `node-fetch` (for external REST API integration)

## ✨ Key Architectural Highlights

* **Typed External API Responses:** Uses custom TypeScript interfaces to enforce type safety on JSON payloads fetched from `https://icanhazdadjoke.com/`.
* **Strict Mode Enabled (`"strict": true`):** Ensures maximum type safety and prevents common runtime errors.
* **Clean Build Pipeline:** Clear separation between TypeScript source code (`./src`) and compiled production JavaScript (`./build`).
* **Modern Developer Experience:** Uses `tsx watch` for instant development reloads and `tsc` for verified production builds.

## 📂 Project Structure

```text
ts-nodejs-webserver/
├── src/
│   └── index.ts        # HTTP server & external API fetch logic
├── build/              # Compiled JavaScript output (ignored in Git)
├── package.json        # Project metadata and scripts
└── tsconfig.json       # TypeScript compiler configuration
```

## 🚀 Getting Started

### Prerequisites

Make sure you have **Node.js** (v18+ recommended) and **npm** installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/TWOJ_LOGIN/ts-nodejs-webserver.git](https://github.com/TWOJ_LOGIN/ts-nodejs-webserver.git)
   cd ts-nodejs-webserver
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🏃‍♂️ Running the Application

* **Development Mode (with live-reload):**
  ```bash
  npm start
  ```

* **Production Build (compiles TS to JS):**
  ```bash
  npm run build
  node build/index.js
  ```

## 📈 Project Roadmap

- [x] Initial TypeScript & Node.js environment setup with `tsx`
- [ ] Implement HTTP server using Node's native `http` module
- [ ] Integrate `icanhazdadjoke.com` REST API using `node-fetch`
- [ ] Define TypeScript interfaces for API response payloads

---
*Created by Marta Łoskot*