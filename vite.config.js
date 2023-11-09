/*
 * @Date: 2023-03-08 10:28:51
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-11-09 09:57:43
 * @FilePath: /bimcc-graph/vite.config.js
 */
import { defineConfig } from 'vite'
import { resolve } from 'path'
import babel from 'vite-plugin-babel';

export default defineConfig((commad, mode) => {
  return {
    root: "test",
    publicDir: 'public',
    server: {
      // host: '127.0.0.1', 
      // port: 5000, 
      // open: true, 
    },
    define: {
    },
    build: {
      target: 'es2015',
      outDir: '../build/umd/',
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'BimccGraph',
        fileName: "BimccGraph",
        formats: ['umd'],
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    },
    plugins: [
      babel(),
    ]
  }
})