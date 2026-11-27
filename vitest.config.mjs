import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.mjs'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['src/models/**/*.mjs', 'src/utils/**/*.mjs', 'src/services/storage.mjs', 'src/services/calendar.mjs', 'src/views/html.mjs'],
      reporter: ['text', 'html', 'json-summary'],
    },
  },
});
