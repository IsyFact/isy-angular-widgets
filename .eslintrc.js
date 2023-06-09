module.exports = {
  "root": true,
  "ignorePatterns": [
    "projects/**/*"
  ],
  "overrides": [
    {
      "files": [
        "*.ts"
      ],
      "parserOptions": {
        "project": [
          "tsconfig.json"
        ],
        tsconfigRootDir: __dirname,
        "createDefaultProgram": true
      },
      "extends": [
        "plugin:jsdoc/recommended-typescript",
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates",
        "plugin:@isyfact/recommended"
      ]
    },
    {
      "files": [
        "*.html"
      ],
      "extends": [
        "plugin:@angular-eslint/template/recommended"
      ],
      "rules": {}
    }
  ],
  "plugins": [
    "jsdoc"
  ]
}
