# IRIS-MINI :- A Voice assitant built using Google Gemini and Glowe.

## Features

1. Can open and close applications on the user's local computer.
2. Can search on google
3. Can tell the weather of a specific location
4. Can tell the current time of a specific location
5. Can tell the current date of a specific location
6. Can tell the current day of a specific location

## How to run

1. Clone the repository
2. Install the dependencies
3. Run the server
4. Open the frontend

## Tech Stack

1. React
2. Node.js
3. Express
4. Socket.io
5. Google Gemini
6. Glowe
7. Windows API

## API Keys

1. Google Gemini API Key
2. OpenWeatherMap API Key

## Project Structure

```
src/
├── client/
│   ├── index.html
│   ├── index.css
│   ├── index.tsx
│   ├── App.tsx
│   └── components/
│       ├── MicrophoneButton.tsx
│       ├── ChatWindow.tsx
│       ├── SystemStatus.tsx
│       └── Waveform.tsx
├── server/
│   ├── index.ts
│   ├── agent/
│   │   ├── iris-voice.ts
│   │   ├── system-agent.ts
│   │   ├── browser-agent.ts
│   │   └── file-agent.ts
│   ├── utils/
│   │   ├── google-genai.ts
│   │   ├── glowe-agent.ts
│   │   ├── file-utils.ts
│   │   └── date-utils.ts
│   └── types/
│       └── app-types.ts
├── public/
└── .env
```
