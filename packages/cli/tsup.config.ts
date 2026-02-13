import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/bin.ts'],
    format: ['cjs'],
    dts: false,
    clean: true,
    sourcemap: true,
    splitting: false,
    target: 'node18',
    outDir: 'dist',
    shims: false,
    banner: {
      js: '#!/usr/bin/env node',
    },
    external: ['openai', 'commander'],
  },
  {
    entry: ['src/index.ts', 'src/runtime.ts'],
    format: ['cjs'],
    dts: false,
    clean: false,
    sourcemap: true,
    splitting: false,
    target: 'node18',
    outDir: 'dist',
    shims: false,
    external: ['openai', 'commander'],
  },
]);
