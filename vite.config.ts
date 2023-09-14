import { UserConfig, defineConfig, loadEnv } from 'vite'
import path, { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'
let dirname = __dirname
console.log('_dir', dirname)

// https://vitejs.dev/config/

const defaultConfig: UserConfig = {
  build: {
    minify: 'esbuild',
    rollupOptions: {
      external: [
        'path',
        'child_process',
        'fs',
        'fs-extra',
        'url',
        'module',
        'commander',
        'inquirer',
        'chalk',
        'download-git-repo',
      ],
      output: {
        strict: false,
        entryFileNames: '[name].js',
      },
    },
  },

  plugins: [],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    // css预处理器
    preprocessorOptions: {
      less: {
        charset: false,
        additionalData: '@import "./src/assets/style/global.less";',
      },
    },
  },
}
// see:http://www.5ityx.com/cate104/134659.html

const config = defineConfig(({ command, mode, ssrBuild }) => {
  const env = loadEnv(mode, process.cwd(), '')
  console.log('mode', mode)
  console.log('command', command)
  if (mode == 'library') {
    return {
      ...defaultConfig,
      plugins: [],
      build: {
        ...(defaultConfig.build || {}),
        outDir: 'lib',
        lib: {
          // Could also be a dictionary or array of multiple entry points
          entry: resolve(__dirname, 'src/library.ts'),
          name: '@cookee/moobox',
          // the proper extensions will be added
          fileName: 'index',
        },
      },
    }
  }

  if (command === 'serve') {
    return {
      ...defaultConfig,
    }
  } else {
    return defaultConfig
  }
})
export default config
