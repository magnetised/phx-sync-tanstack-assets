import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProd = mode === 'production'

  return {
    publicDir: false,
    build: {
      outDir: '../priv/static',
      target: ['es2022'],
      minify: isProd,
      sourcemap: !isProd,
      rollupOptions: {
        input: 'js/app.tsx',
        output: {
          assetFileNames: 'assets/[name][extname]',
          chunkFileNames: 'assets/chunk/[name].js',
          entryFileNames: 'assets/[name].js',
        },
      },
    },
    define: {
      __APP_ENV__: env.APP_ENV,
      // Explicitly force production React
      'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
      'import.meta.env.PROD': isProd,
      'import.meta.env.DEV': !isProd,
    },
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
        routesDirectory: "./js/routes",
        generatedRouteTree: "./js/routeTree.gen.ts",
      }),
      react(),
      tailwindcss(),
    ],
  }
})
