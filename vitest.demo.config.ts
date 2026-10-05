import angular from '@analogjs/vite-plugin-angular';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {defineConfig, type ViteUserConfig} from 'vitest/config';

const workspaceRoot = path.dirname(fileURLToPath(import.meta.url));
const angularPlugins = angular({
  tsconfig: path.join(workspaceRoot, 'projects/isy-angular-widgets-demo/tsconfig.spec.json'),
  workspaceRoot
}) as unknown as ViteUserConfig['plugins'];

export default defineConfig({
  plugins: angularPlugins,
  resolve: {
    alias: [
      {
        find: /^@isy-angular-widgets\/public-api$/,
        replacement: path.join(workspaceRoot, 'projects/isy-angular-widgets/src/public-api')
      },
      {
        find: /^@isy-angular-widgets\//,
        replacement: path.join(workspaceRoot, 'projects/isy-angular-widgets/src/lib/')
      },
      {
        find: /^isy-angular-widgets$/,
        replacement: path.join(workspaceRoot, 'projects/isy-angular-widgets/src/public-api')
      }
    ]
  },
  test: {
    globals: true,
    environment: 'jsdom',
    restoreMocks: true,
    include: ['projects/isy-angular-widgets-demo/src/**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/coverage/**'],
    server: {
      deps: {
        inline: ['@ngneat/spectator', 'primeng']
      }
    },
    setupFiles: ['./vitest.demo.setup.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage/isy-angular-widgets-demo-vitest',
      reporter: ['text', 'html', 'lcov']
    }
  }
});
