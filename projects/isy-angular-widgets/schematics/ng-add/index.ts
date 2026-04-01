import {Rule, SchematicContext, SchematicsException, Tree} from '@angular-devkit/schematics';
import {NodePackageInstallTask} from '@angular-devkit/schematics/tasks';
import {addDevPackageToPackageJson, addPackageToPackageJson, addScriptToPackageJson} from './package-config';
import {Schema} from './schema';

// Node Buffer (isyTranslation) is not supported in Browser context but schematics is executed with node and not with browser
/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-call */

interface ArchitectOptions {
  styles?: string[];
  assets?: (string | {input: string})[];
  tsConfig?: string;
}

interface MyBuild {
  options: ArchitectOptions;
  configurations?: {
    development?: {tsConfig?: string};
  };
}

interface MyTest {
  options: {
    tsConfig?: string;
  };
}

interface Architect {
  build: MyBuild;
  test?: MyTest;
}

interface ProjectInfo {
  projectType: string;
  root: string;
  sourceRoot: string;
  prefix?: string;
  architect: Architect;
}

interface Workspace {
  projects: {
    [key: string]: ProjectInfo;
  };
}

/**
 * Add necessary styles for isy-angular-widgets to the angular workspace.
 * @param workspace Current angular workspace object
 * @param context A rule factory, which is normally the way schematics are implemented. Returned by the tooling after loading a schematic description
 * @param tree List of styles
 * @returns Tree Tree with styles
 */
function applyStylesToWorkspace(workspace: Workspace, context: SchematicContext, tree: Tree): Tree {
  const styles = [
    'node_modules/primeicons/primeicons.css',
    'node_modules/primeflex/primeflex.min.css',
    'node_modules/@isyfact/isy-angular-widgets/assets/theme/isyfact-theme.scss'
  ];
  const projects = workspace?.projects || [];
  let projectName;

  for (const key in projects) {
    if (projects[key].projectType === 'application') {
      projectName = key;
    }
  }

  if (!projectName) {
    context.logger.warn('⚠ Skipping add styles: Workspace does not contain any project from type application.');
    return tree;
  }

  const project = projects[projectName];

  if (!project?.architect?.build?.options) {
    context.logger.warn(`⚠ Skipping add styles: Missing architect configuration on project ${projectName}.`);
    return tree;
  }

  if (project.architect.build.options.styles) {
    const concatStyles = project.architect.build.options.styles.concat(styles);

    // Using Set to get distinct entries
    project.architect.build.options.styles = [...new Set(concatStyles)];
  } else {
    project.architect.build.options.styles = styles;
  }

  const space = 2;
  const angularJson = JSON.stringify(workspace, null, space);
  tree.overwrite('/angular.json', angularJson);

  context.logger.info('√ Add isy-angular-widgets styles.');

  return tree;
}

/**
 * Adds the specified assets path (`src/assets`) to the assets array of the first application project
 * found in the provided Angular workspace configuration. If the assets array does not exist, it is initialized.
 * If the assets path is already present, no changes are made.
 * @param workspace - The Angular workspace configuration object.
 * @param context - The schematic context used for logging and reporting.
 * @param tree - The virtual file system tree representing the project files.
 * @returns The updated virtual file system tree.
 */
function applyAssetsToWorkspace(workspace: Workspace, context: SchematicContext, tree: Tree): Tree {
  const assetsPath = 'src/assets';
  const projects = workspace?.projects || [];

  let projectName: string | undefined;
  for (const key in projects) {
    if (projects[key].projectType === 'application') {
      projectName = key;
      break;
    }
  }

  if (!projectName) {
    context.logger.warn('⚠ Skipping: No application project found.');
    return tree;
  }

  const project = projects[projectName];
  const buildOptions = project.architect.build.options;

  if (Array.isArray(buildOptions.assets)) {
    const hasAssets = buildOptions.assets.some((entry) =>
      typeof entry === 'string' ? entry === assetsPath : entry.input === assetsPath
    );
    if (!hasAssets) {
      buildOptions.assets.push(assetsPath);
      context.logger.info(`√ Added '${assetsPath}' to assets array.`);
    }
  } else {
    buildOptions.assets = [assetsPath];
    context.logger.info(`√ Initialized assets array with '${assetsPath}'.`);
  }

  const space = 2;
  tree.overwrite('/angular.json', JSON.stringify(workspace, null, space));
  return tree;
}

/**
 * Loads the angular workspace store in angular.json.
 * @param tree List with angular.json properties
 * @returns Workspace Part structure of angular.json file
 * @throws {SchematicsException} if workspace is not available
 */
function loadWorkspace(tree: Tree): Workspace {
  const workspaceConfig = tree.read('/angular.json');

  if (!workspaceConfig) {
    throw new SchematicsException('❌ Could not find Angular workspace configuration.');
  }

  return JSON.parse(workspaceConfig.toString()) as Workspace;
}

/**
 * Create new translation file or merge if one already exists.
 * @param context A rule factory, which is normally the way schematics are implemented. Returned by the tooling after loading a schematic description.
 * @param tree Tree with translation files
 * @param language the current language
 * @throws {SchematicsException} if translation file does not exist or is empty
 */
export function addTranslationFile(context: SchematicContext, tree: Tree, language: string): void {
  const isyTranslation = tree.read('./node_modules/@isyfact/isy-angular-widgets/assets/i18n/' + language);
  const translationFilePath = '/src/assets/i18n/' + language;

  if (!isyTranslation) {
    throw new SchematicsException('❌ Could not find isy-angular-widgets translation file.');
  }

  if (tree.exists(translationFilePath)) {
    const translation = tree.read(translationFilePath);

    if (!translation) throw new SchematicsException(`❌ Could not read directory ${translationFilePath}.`);

    let translationJson = JSON.parse(translation.toString('utf-8'));
    const isyTranslationJson = JSON.parse(isyTranslation.toString('utf-8'));

    if (translationJson) {
      translationJson = {...translationJson, ...isyTranslationJson};
      context.logger.info('√ Add language keys (de, en) for isy-angular-widgets to existing language files.');
    }

    const space = 2;
    tree.overwrite(translationFilePath, JSON.stringify(translationJson, null, space));
  } else {
    tree.create(translationFilePath, isyTranslation.toString('utf-8'));
    context.logger.info('√ Add language files (de, en) for isy-angular-widgets.');
  }
}

/**
 * Determines whether the workspace is a monorepo (multiple projects each with their own subdirectory)
 * or a simple single-app project (root project located at the workspace root).
 * @param workspace The angular workspace configuration
 * @returns true if the workspace is a monorepo
 */
function isMonorepo(workspace: Workspace): boolean {
  return Object.values(workspace.projects).every((project) => project.root !== '');
}

/**
 * Generates a TypeScript/HTML config block for a single project to be embedded in eslint.config.js.
 * @param name Project name
 * @param project Project info
 * @returns JavaScript source string for the config blocks
 */
function generateProjectConfigBlock(name: string, project: ProjectInfo): string {
  const sourceRoot = project.sourceRoot || `src`;
  const prefix = project.prefix || 'app';

  const buildTsConfig =
    project.architect?.build?.options?.tsConfig ?? project.architect?.build?.configurations?.development?.tsConfig;

  const testTsConfig = project.architect?.test?.options?.tsConfig;

  const buildProjectList = buildTsConfig ? `'${buildTsConfig}'` : '';
  const testProjectList = testTsConfig ? `'${testTsConfig}'` : '';

  return `
    // ${name}: TS
    {
      files: ['${sourceRoot}/**/*.ts'],
      ignores: ['${sourceRoot}/**/*.spec.ts'],
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          project: [${buildProjectList}],
          tsconfigRootDir: __dirname,
          sourceType: 'module'
        }
      },
      plugins: {'@angular-eslint': angular},
      rules: {
        ...angular.configs.recommended.rules,
        '@angular-eslint/directive-selector': ['error', {type: 'attribute', prefix: '${prefix}', style: 'camelCase'}],
        '@angular-eslint/component-selector': ['error', {type: 'element', prefix: '${prefix}', style: 'kebab-case'}]
      }
    },
    // ${name}: Spec TS
    {
      files: ['${sourceRoot}/**/*.spec.ts'],
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          project: [${testProjectList}],
          tsconfigRootDir: __dirname,
          sourceType: 'module'
        }
      },
      rules: {}
    },
    // ${name}: HTML
    {
      files: ['${sourceRoot}/**/*.html'],
      languageOptions: {parser: angularTemplateParser},
      plugins: {'@angular-eslint/template': angularTemplate},
      rules: {...angularTemplate.configs.recommended.rules}
    },
    // ${name}: Inline Templates
    {
      files: ['${sourceRoot}/**/*.component.ts'],
      plugins: {
        '@angular-eslint': angular,
        '@angular-eslint/template': angularTemplate
      },
      processor: angularTemplate.processors['extract-inline-html']
    }`;
}

/**
 * Generates the content for eslint.config.js based on the workspace structure.
 * Supports both simple Angular projects and monorepos.
 * @param workspace The angular workspace configuration
 * @returns The content of the eslint.config.js file as a string
 */
function generateEslintConfigContent(workspace: Workspace): string {
  const projectEntries = Object.entries(workspace.projects);
  const projectBlocks = projectEntries.map(([name, project]) => generateProjectConfigBlock(name, project)).join(',\n');

  return `// @ts-check
const tsParser = require('@typescript-eslint/parser');
const angular = require('@angular-eslint/eslint-plugin');
const angularTemplate = require('@angular-eslint/eslint-plugin-template');
const angularTemplateParser = require('@angular-eslint/template-parser');
const {configs} = require('@isyfact/eslint-plugin');

module.exports = (async () => {
  // 'recommended' is an async factory → hence, we need to await it
  const recommendedCfg = await configs.recommended();

  return [
    // Ignore non-relevant files
    {ignores: ['**/node_modules/*', 'node_modules/', 'karma.conf.js']},

    // Apply IsyFact recommended configuration
    ...recommendedCfg,
${projectBlocks},

    // Unit test exceptions from IsyFact
    ...configs.test
  ];
})();
`;
}

/**
 * Installs @isyfact/eslint-plugin and related ESLint packages as devDependencies and
 * creates an eslint.config.js if none is present yet.
 * @param workspace The angular workspace configuration
 * @param context The schematic context used for logging
 * @param tree The virtual file system tree
 * @returns The updated tree
 */
function setupEslint(workspace: Workspace, context: SchematicContext, tree: Tree): Tree {
  addDevPackageToPackageJson(tree, '@isyfact/eslint-plugin', '^4.1.0');
  addDevPackageToPackageJson(tree, '@angular-eslint/eslint-plugin', '^21.0.0');
  addDevPackageToPackageJson(tree, '@angular-eslint/eslint-plugin-template', '^21.0.0');
  addDevPackageToPackageJson(tree, '@angular-eslint/template-parser', '^21.0.0');
  addDevPackageToPackageJson(tree, '@typescript-eslint/parser', '^8.0.0');
  addDevPackageToPackageJson(tree, 'eslint', '^9.0.0');

  context.logger.info('√ Added @isyfact/eslint-plugin and related ESLint packages to devDependencies.');

  addScriptToPackageJson(tree, 'lint', 'eslint .');
  context.logger.info('√ Added npm script "lint".');

  const eslintConfigPath = '/eslint.config.js';

  if (tree.exists(eslintConfigPath)) {
    return patchExistingEslintConfig(workspace, context, tree, eslintConfigPath);
  }

  const monorepo = isMonorepo(workspace);
  context.logger.info(`√ Detected workspace type: ${monorepo ? 'Monorepo' : 'Simple project'}.`);

  const configContent = generateEslintConfigContent(workspace);
  tree.create(eslintConfigPath, configContent);

  context.logger.info('√ Created eslint.config.js with IsyFact ESLint rules.');

  return tree;
}

/**
 * Installs isy-angular-widgets as dependency and adds the necessary styles to the workspace.
 * @param options Schema options for the schematic
 * @returns Rule
 */
export function ngAdd(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    addTranslationFile(context, tree, 'de.json');
    addTranslationFile(context, tree, 'en.json');

    // Add necessary dependencies to new CLI project.

    addPackageToPackageJson(tree, '@angular/common', '^21.1.4');
    addPackageToPackageJson(tree, '@angular/core', '^21.1.4');
    addPackageToPackageJson(tree, 'primeicons', '^7.0.0');
    addPackageToPackageJson(tree, 'primeng', '^21.1.1');
    addPackageToPackageJson(tree, '@primeuix/themes', '^2.0.3');
    addPackageToPackageJson(tree, 'primeflex', '^4.0.0');

    // Install isy-angular-widgets
    context.addTask(new NodePackageInstallTask());

    const workspace = loadWorkspace(tree);

    if (options.addEslint) {
      setupEslint(workspace, context, tree);
    }

    applyStylesToWorkspace(workspace, context, tree);
    return applyAssetsToWorkspace(workspace, context, tree);
  };
}
function patchExistingEslintConfig(
  workspace: Workspace,
  context: SchematicContext,
  tree: Tree,
  eslintConfigPath: string
): Tree {
  const fileBuffer = tree.read(eslintConfigPath);

  if (!fileBuffer) {
    throw new SchematicsException(`❌ Could not read ${eslintConfigPath}.`);
  }

  let content = fileBuffer.toString('utf-8');

  // Bereits konfiguriert? Dann nichts tun.
  if (content.includes("@isyfact/eslint-plugin")) {
    context.logger.info('√ Existing eslint.config.js already contains IsyFact ESLint configuration.');
    return tree;
  }

  // 1) requires ergänzen
  const requiredSnippets = [
    "const tsParser = require('@typescript-eslint/parser');",
    "const angular = require('@angular-eslint/eslint-plugin');",
    "const angularTemplate = require('@angular-eslint/eslint-plugin-template');",
    "const angularTemplateParser = require('@angular-eslint/template-parser');",
    "const {configs} = require('@isyfact/eslint-plugin');"
  ];

  for (const snippet of requiredSnippets) {
    if (!content.includes(snippet)) {
      content = `${snippet}\n${content}`;
    }
  }

  const projectEntries = Object.entries(workspace.projects);
  const projectBlocks = projectEntries.map(([name, project]) => generateProjectConfigBlock(name, project)).join(',\n');

  const isyBlock = `
  const recommendedCfg = await configs.recommended();

  return [
    {ignores: ['**/node_modules/*', 'node_modules/', 'karma.conf.js']},
    ...recommendedCfg,
${projectBlocks},
    ...configs.test,
`;

  // 2) async-flat-config patchen
  if (content.includes('return [')) {
    if (!content.includes('recommendedCfg')) {
      content = content.replace(/return\s*\[/, isyBlock);
    }

    // ignores nur ergänzen, wenn noch nicht vorhanden
    if (!content.includes('karma.conf.js')) {
      content = content.replace(/return\s*\[/, `return [\n    {ignores: ['**/node_modules/*', 'node_modules/', 'karma.conf.js']},`);
    }

    tree.overwrite(eslintConfigPath, content);
    context.logger.info('√ Patched existing eslint.config.js with IsyFact ESLint configuration.');
    return tree;
  }

  // 3) sync-flat-config patchen: module.exports = [ ... ]
  if (content.includes('module.exports = [')) {
    const replacement = `module.exports = (async () => {
  const recommendedCfg = await configs.recommended();

  return [
    {ignores: ['**/node_modules/*', 'node_modules/', 'karma.conf.js']},
    ...recommendedCfg,
${projectBlocks},
    ...configs.test,`;

    content = content.replace(/module\.exports\s*=\s*\[/, replacement);

    // Nur falls die Datei wirklich als Array endet
    if (content.trim().endsWith('];')) {
      content = content.replace(/];\s*$/, `
  ];
})();
`);
    }

    tree.overwrite(eslintConfigPath, content);
    context.logger.info('√ Converted and patched existing eslint.config.js with IsyFact ESLint configuration.');
    return tree;
  }

  context.logger.warn(
    '⚠ Existing eslint.config.js uses an unsupported format. Please manually add the @isyfact/eslint-plugin configuration.'
  );
  return tree;
}
