import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Vercel serves the app from the domain root. Keeping this as `/`
  // prevents production assets from being requested under the old
  // GitHub Pages `/SAYANOX-FORGE/` path.
  base: '/',
});
