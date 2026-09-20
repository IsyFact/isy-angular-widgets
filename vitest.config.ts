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
    include: [
      'projects/isy-angular-widgets/src/**/*.vitest.spec.ts',
      'projects/isy-angular-widgets-demo/src/**/*.vitest.spec.ts'
    ],
    exclude: ['**/node_modules/**', '**/dist/**', '**/coverage/**'],
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage/vitest',
      reporter: ['text', 'html', 'lcov']
    }
  }
});
