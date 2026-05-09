import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: "client", 
  build: {
    outDir: "../dist/client", // Build output goes here
    emptyOutDir: true,
  },
  server: {
    port: 5173, 
    proxy: {
      "/api": "http://localhost:5050",
    },
  },
});
