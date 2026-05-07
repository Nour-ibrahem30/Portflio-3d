import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    // Brotli compression
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      compressionOptions: {
        level: 11
      }
    }),
    // Gzip compression
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      compressionOptions: {
        level: 9
      }
    })
  ],
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 3,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        dead_code: true,
        unused: true
      },
      format: {
        comments: false
      },
      mangle: {
        safari10: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - more granular splitting
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'react-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'framer-vendor';
            }
            if (id.includes('gsap')) {
              return 'gsap-vendor';
            }
            if (id.includes('firebase')) {
              return 'firebase-vendor';
            }
            // Group all other vendors together
            return 'vendor';
          }
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `images/[name]-[hash].[ext]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `fonts/[name]-[hash].[ext]`;
          }
          return `[ext]/[name]-[hash].[ext]`;
        }
      },
      treeshake: {
        moduleSideEffects: 'no-external',
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      }
    },
    chunkSizeWarningLimit: 800,
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: false, // Faster builds
    assetsInlineLimit: 4096 // Inline small assets
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'gsap'],
    exclude: ['three']
  },
  server: {
    hmr: {
      overlay: false
    }
  }
})
