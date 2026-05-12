<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0F9D58&height=250&section=header&text=IRIS%20Mini&fontSize=90&fontColor=ffffff&animation=fadeIn&desc=A%20Premium%20Voice%20AI%20Assistant%20powered%20by%20Google%20Gemini%20Live&descAlignY=70&descAlign=62" />
</div>

<p align="center">
  <strong>The Ultimate Desktop Voice Assistant with a Seamless CLI Experience</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Google-Gemini_Live-0F9D58?style=for-the-badge&logo=google" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/CLI-Ready-0F9D58?style=for-the-badge&logo=command-line" alt="CLI Ready" />
  <img src="https://img.shields.io/badge/React-UI-0F9D58?style=for-the-badge&logo=react" alt="React UI" />
  <img src="https://img.shields.io/badge/Node.js-Backend-0F9D58?style=for-the-badge&logo=nodedotjs" alt="Node.js" />
</p>

---

## 🌟 Overview

**IRIS-MINI** is a production-grade, state-of-the-art Voice AI Assistant. Harnessing the power of the **Google Gemini Live API**, IRIS provides real-time, conversational interactions combined with powerful system integrations.

Whether you prefer a beautiful graphical interface or a blazing-fast command-line experience, IRIS-MINI adapts to your workflow seamlessly.

## 📸 Showcase

| **Premium Web Interface** | **Hacker-Style CLI** |
| :---: | :---: |
| <img src="assets/1.png" width="450" alt="IRIS Web UI" /> | <img src="assets/2.png" width="450" alt="IRIS CLI" /> |
| *Beautiful Three.js Visualizer & React UI* | *Clean, Silent & Branded Terminal Experience* |

---

## ✨ Features

- 🎙️ **Advanced Voice AI**: Powered by Google Gemini Live API for real-time, low-latency, and highly intelligent conversational experiences.
- 💻 **Deep OS Integration**: Seamlessly open, close, and manage applications on your local Windows machine.
- 🌍 **Web Search & Knowledge**: Instantly search Google and fetch accurate, up-to-date information.
- ⛅ **Real-Time Data**: Get the latest weather updates, time, date, and day information for any specific location worldwide.
- 🚀 **CLI Powerhouse**: Exposes an easy-to-use Command Line Interface (CLI) for power users to manage the assistant entirely from the terminal.

## 🛠️ Tech Stack

Built with modern, robust technologies ensuring high performance and a premium feel:

- **Frontend**: React, Tailwind CSS, Framer Motion, Three.js
- **Backend**: Node.js, Express, Socket.io
- **AI Core**: Google Gemini Live API, Glowe Agent
- **System**: Windows API, Decibri (Microphone integration)

## 🔑 Prerequisites

Before you begin, ensure you have obtained the necessary API Keys:

- [Google Gemini API Key](https://aistudio.google.com/app/apikey)
- [OpenWeatherMap API Key](https://openweathermap.org/api)

## 🚀 Quick Start

You can use IRIS-MINI as a globally installed CLI or run it locally from the source code.

### Option A: Global CLI Installation (Recommended)

Install the package globally via npm:

```bash
npm install -g iris-mini
```

_(Testing locally? Build the package and install via tarball: `npm install -g ./iris-mini-1.0.0.tgz`)_

Launch the assistant from your terminal from anywhere by simply typing:

```bash
iris
```

### Option B: Local Development

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/iris-mini.git
cd iris-mini
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Environment Variables

Create a `.env` file in the root directory and add your API keys:

```env
GEMINI_API_KEY=your_gemini_api_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

#### 4. Run the Project

To run the server and client concurrently in development mode:

```bash
npm run dev
```

## 📂 Project Structure

```text
├── bin/                 # CLI Executable
│   └── iris-mini.ts
├── data/                # Local data storage
│   └── memory.json
├── public/              # Static Assets
├── src/
│   ├── client/          # Premium React Frontend
│   │   ├── assets/
│   │   ├── utils/
│   │   │   └── AICore.tsx
│   │   ├── views/
│   │   │   └── IrisMini.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── config/          # Configuration handling
│   │   └── dot-env.ts
│   └── server/          # Powerful Node.js Backend
│       ├── agent/       # Core Voice Agent
│       │   └── iris-voice.ts
│       ├── constants/
│       │   └── StreamConfig.ts
│       ├── lib/
│       │   └── port-picker.ts
│       ├── tools/       # Specialized Agents
│       │   ├── app-agent.ts
│       │   ├── browser-agent.ts
│       │   └── nexus-agent.ts
│       ├── utils/       # Utility Functions
│       │   └── memory.ts
│       └── main.ts      # Server entrypoint
├── Dockerfile           # Docker Containerization
├── docker-compose.yml   # Multi-container setup
├── .nvmrc               # Node Version Control
├── .npmrc               # NPM Configuration
└── .env                 # Environment Configuration
```

## 🛠️ Developer Experience (DX)

IRIS-MINI is built with a production-ready developer experience in mind. It includes:

- **Node Version Management**: `.nvmrc` and `.npmrc` to strictly control and match Node/NPM environments.
- **Containerization**: Native `Dockerfile` and `docker-compose.yml` support for easy isolated deployments.
- **Code Quality**: Enforced linting and formatting rules via Prettier and Commitlint.
- **Changelog Automation**: Configurations for automated, standardized changelog generation.

## 🤝 Contributing

We welcome contributions from the community! Whether you want to fix bugs, improve documentation, or add new features, please check our [Contributing Guidelines](CONTRIBUTING.md) to get started.

Please ensure you also review our [Code of Conduct](CODE_OF_CONDUCT.md) to keep our community approachable and respectable.

## 🛡️ Security

Security is a priority. For instructions on how to report vulnerabilities and our security practices, please refer to our [Security Policy](SECURITY.md).

## 📄 License

This project is licensed under the terms of the included [LICENSE](LICENSE) file.

---

<p align="center">
  Built with 💚 and powered by AI.
</p>
