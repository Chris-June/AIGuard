import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@guardforge/core': path.resolve(__dirname, 'packages/core/src/index.ts'),
      '@guardforge/rules': path.resolve(__dirname, 'packages/rules/src/index.ts'),
      '@guardforge/adapters-openai': path.resolve(
        __dirname,
        'packages/adapters-openai/src/index.ts',
      ),
      '@guardforge/reporter': path.resolve(__dirname, 'packages/reporter/src/index.ts'),
      '@chrisjune/guardforge': path.resolve(__dirname, 'packages/cli/src/index.ts'),
    },
  },
  test: {
    include: ['packages/**/*.test.ts'],
    coverage: {
      enabled: false,
    },
  },
});
