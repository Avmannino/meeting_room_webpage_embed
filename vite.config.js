import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // GitHub Pages project site base:
  base: "/meeting_room_webpage_embed/",
});
