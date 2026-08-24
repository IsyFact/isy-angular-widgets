const angular = require('@angular-eslint/eslint-plugin');
const angularTemplate = require('@angular-eslint/eslint-plugin-template');
const angularTemplateParser = require('@angular-eslint/template-parser');
const jsdoc = require('eslint-plugin-jsdoc');
const {configs} = require('@isyfact/eslint-plugin');

module.exports = (async () => {
  const recommendedCfg = await configs.recommended();

  return [
    // Apply isyfact configurations only to TS files
    ...recommendedCfg,

    // Library: TS
    {
      files: ['projects/isy-angular-widgets/**/*.ts'],
      languageOptions: {
        parserOptions: {
          project: [
            'projects/isy-angular-widgets/tsconfig.lib.json',
            'projects/isy-angular-widgets/tsconfig.spec.json'
          ],
          tsconfigRootDir: __dirname
        }
      },
      plugins: {
        '@angular-eslint': angular,
        jsdoc
      },
      rules: {
        ...angular.configs.recommended.rules,
        ...jsdoc.configs['recommended-typescript'].rules,
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'isy',
            style: 'camelCase'
          }
        ],
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'isy',
            style: 'kebab-case'
          }
        ]
      }
    },

    // Library: HTML
    {
      files: ['projects/isy-angular-widgets/**/*.html'],
      languageOptions: {
        parser: angularTemplateParser
      },
      plugins: {
        '@angular-eslint/template': angularTemplate
      },
      rules: {
        ...angularTemplate.configs.recommended.rules
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
        parserOptions: {
          project: [
            'projects/isy-angular-widgets-demo/tsconfig.app.json',
            'projects/isy-angular-widgets-demo/tsconfig.spec.json'
          ],
          tsconfigRootDir: __dirname
        }
      },
      plugins: {
        '@angular-eslint': angular,
        jsdoc
      },
      rules: {
        ...angular.configs.recommended.rules,
        ...jsdoc.configs['recommended-typescript'].rules,
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'demo',
            style: 'camelCase'
          }
        ],
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'demo',
            style: 'kebab-case'
          }
        ]
      }
    },

    // Demo: HTML
    {
      files: ['projects/isy-angular-widgets-demo/**/*.html'],
      languageOptions: {
        parser: angularTemplateParser
      },
      plugins: {
        '@angular-eslint/template': angularTemplate
      },
      rules: {
        ...angularTemplate.configs.recommended.rules
      }
    },

    // Global test overrides from IsyFact
    ...configs.test
  ];
})();
