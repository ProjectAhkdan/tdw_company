import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/tests/**/*.test.ts', 'src/tests/**/*.spec.ts'],
  },
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
})
