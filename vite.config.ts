// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "client",
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5050", // Use the IP, not 'localhost'
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "../dist/client",
    emptyOutDir: true,
  },
});
