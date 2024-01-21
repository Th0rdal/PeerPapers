import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({})],
  server: {
    proxy: {
      // Alle Anfragen an /api werden an den Backend-Server weitergeleitet
      "/api": {
        target: "http://127.0.0.1:25202",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
