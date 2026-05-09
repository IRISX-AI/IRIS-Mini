import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: "client", // Vite looks here for index.html
  build: {
    outDir: "../dist/client", // Build output goes here
    emptyOutDir: true,
  },
  server: {
    port: 5173, // Vite dev server port
    proxy: {
      "/api": "http://localhost:5050", // Forwards API calls to Express
    },
  },
});
