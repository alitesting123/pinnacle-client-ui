// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Proxy API requests to your FastAPI backend during development
    proxy: {
      '/api': {
        target: mode === 'development' 
          ? 'http://localhost:8000'
          : 'https://dlndpgwc2naup.cloudfront.net',
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: mode === 'development'
          ? 'http://localhost:8000'
          : 'https://dlndpgwc2naup.cloudfront.net',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // ✅ ADDED: Explicitly include public directory
  publicDir: 'public',
  
  // Define environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  
  // ✅ ADDED: Build configuration for production
  build: {
    outDir: 'dist',
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
}));