import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Shim process.env for libraries that might expect it in a browser environment
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
      API_KEY: JSON.stringify(''),
      GOOGLE_MAPS_API_KEY: JSON.stringify(''),
      SUPABASE_URL: JSON.stringify('https://smatromfcrduzpipjwot.supabase.co'),
      SUPABASE_ANON_KEY: JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtYXRyb21mY3JkdXpwaXBqd290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTkwMDYsImV4cCI6MjA4MzI5NTAwNn0.Xz9-8BC-XRXgKiGJRh8uvSULmeES84jYXl7YVYt3MkY')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  }
});