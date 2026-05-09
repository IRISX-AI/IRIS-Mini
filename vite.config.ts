import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: "client",
  build: {
    outDir: "../dist/client",
    emptyOutDir: true, // Cleans the folder before each rebuild
    watch: {
      // Ensures the build watcher is sensitive to changes
      include: 'src/**',
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
    },
  },
});