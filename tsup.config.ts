import { defineConfig, type Options } from 'tsup'
import { bundleless } from 'tsup-plugin-bundleless'

const tsupConfig: Options = {
  entry: ['src/**/*.{ts,tsx}', '!src/**/tests/**'],
  platform: 'browser',
  dts: true,
}

const esm: Options = {
  ...tsupConfig,
  format: ['esm'],
  outDir: 'dist/es',
  splitting: true,
  ...bundleless(),
}

const cjs: Options = {
  ...tsupConfig,
  format: ['cjs'],
  outDir: 'dist/lib',
  splitting: false,
  ...bundleless(),
}

export default defineConfig((option) => {
  if (option.watch) {
    // dev mode
    return esm
  }
  return [esm, cjs]
})
