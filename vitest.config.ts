import angular from '@analogjs/vite-plugin-angular';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {defineConfig, type ViteUserConfig} from 'vitest/config';

const workspaceRoot = path.dirname(fileURLToPath(import.meta.url));
const angularPlugins = angular({
  tsconfig: path.join(workspaceRoot, 'projects/isy-angular-widgets/tsconfig.spec.json'),
  workspaceRoot
}) as unknown as ViteUserConfig['plugins'];

export default defineConfig({
  plugins: angularPlugins,
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['projects/isy-angular-widgets/src/**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/coverage/**'],
    server: {
      deps: {
        inline: ['@ngneat/spectator']
      }
    },
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['projects/isy-angular-widgets/src/lib/**/*.ts'],
      reportsDirectory: './coverage/isy-angular-widgets-vitest',
      reporter: ['text', 'html', 'lcov', 'json-summary'],
      thresholds: {lines: 85, statements: 85, functions: 85, branches: 85}
    }
  }
});
