import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@backend/": path.resolve(__dirname, "../server/src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 4071, 
  },
  preview: {
    host: "0.0.0.0",
    port: 4071, 
  }
});
