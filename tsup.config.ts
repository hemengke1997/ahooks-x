import { defineConfig, type Options } from 'tsup'
import { bundleless } from 'tsup-plugin-bundleless'

const tsupConfig: Options = {
  entry: ['src/**/*.{ts,tsx}'],
  bundle: true,
  platform: 'browser',
  splitting: false,
}

const esm: Options = {
  ...tsupConfig,
  format: ['esm'],
  outDir: 'dist/es',
  outExtension: () => ({ js: '.js' }),
  plugins: [bundleless({ ext: '.js' })],
}

const cjs: Options = {
  ...tsupConfig,
  format: ['cjs'],
  outDir: 'dist/lib',
  outExtension: () => ({ js: '.cjs' }),
  plugins: [bundleless({ ext: '.cjs' })],
}

export default defineConfig([esm, cjs])
