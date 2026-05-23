import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    globals: true,
    include: ['src/tests/**/*.test.ts', 'src/tests/**/*.spec.ts'],
  },
  resolve: {
    alias: {
      'next/headers': resolve(__dirname, './src/tests/__mocks__/next-headers.ts'),
    },
  },
})
