const tsParser = require('@typescript-eslint/parser');
const angular = require('@angular-eslint/eslint-plugin');
const angularTemplate = require('@angular-eslint/eslint-plugin-template');
const angularTemplateParser = require('@angular-eslint/template-parser');

const {configs} = require('@isyfact/eslint-plugin');

module.exports = (async () => {
  // recommended ist bei dir eine async factory → daher await
  const recommendedCfg = await configs.recommended();

  return [
    {ignores: ['**/node_modules/*', 'node_modules/']},

    // isyfact-Configs nur auf TS-Dateien anwenden
    ...recommendedCfg,

    // Library: TS
    {
      files: ['projects/isy-angular-widgets/**/*.ts'],
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          project: [
            'projects/isy-angular-widgets/tsconfig.lib.json',
            'projects/isy-angular-widgets/tsconfig.spec.json'
          ],
          tsconfigRootDir: __dirname,
          sourceType: 'module'
        }
      },
      plugins: {'@angular-eslint': angular},
      rules: {
        ...angular.configs.recommended.rules,
        '@angular-eslint/directive-selector': ['error', {type: 'attribute', prefix: 'isy', style: 'camelCase'}],
        '@angular-eslint/component-selector': ['error', {type: 'element', prefix: 'isy', style: 'kebab-case'}]
      }
    },

    // Library: HTML
    {
      files: ['projects/isy-angular-widgets/**/*.html'],
      languageOptions: {parser: angularTemplateParser},
      plugins: {'@angular-eslint/template': angularTemplate},
      rules: {
        ...angularTemplate.configs.recommended.rules,
        '@typescript-eslint/only-throw-error': 'off'
      }
    },

    // Library: Inline-Templates
    {
      files: ['projects/isy-angular-widgets/**/*.component.ts'],
      plugins: {
        '@angular-eslint': angular,
        '@angular-eslint/template': angularTemplate
      },
      processor: angularTemplate.processors['extract-inline-html']
    },

    // Library: Specs
    {
      files: ['projects/isy-angular-widgets/**/*.spec.ts'],
      rules: {
        '@angular-eslint/directive-selector': 'off',
        '@angular-eslint/component-selector': 'off'
      }
    },

    // Demo: TS
    {
      files: ['projects/isy-angular-widgets-demo/**/*.ts'],
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          project: [
            'projects/isy-angular-widgets-demo/tsconfig.app.json',
            'projects/isy-angular-widgets-demo/tsconfig.spec.json'
          ],
          tsconfigRootDir: __dirname,
          sourceType: 'module'
        }
      },
      plugins: {'@angular-eslint': angular},
      rules: {
        ...angular.configs.recommended.rules
      }
    },

    // Demo: HTML
    {
      files: ['projects/isy-angular-widgets-demo/**/*.html'],
      languageOptions: {parser: angularTemplateParser},
      plugins: {'@angular-eslint/template': angularTemplate},
      rules: {
        ...angularTemplate.configs.recommended.rules,
        '@typescript-eslint/only-throw-error': 'off'
      }
    },

    // Tests global aus isyfact
    ...configs.test
  ];
})();
