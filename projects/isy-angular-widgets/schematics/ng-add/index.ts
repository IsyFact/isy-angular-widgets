import {Rule, SchematicContext, SchematicsException, Tree} from '@angular-devkit/schematics';
import {NodePackageInstallTask} from '@angular-devkit/schematics/tasks';
import {Buffer} from 'node:buffer';
import {addDevPackageToPackageJson, addPackageToPackageJson} from './package-config';

const JSON_INDENT_SPACES = 2;
const MAX_LOGGED_TRANSLATION_CONFLICTS = 10;

// Node Buffer (isyTranslation) is not supported in Browser context but schematics is executed with node and not with browser
/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-call */

interface BuildOptions {
  styles?: string[];
  assets?: (string | {input: string})[];
}

interface BuildTarget {
  options?: BuildOptions;
}

interface Architect {
  build?: BuildTarget;
}

interface ProjectDefinition {
  projectType: string;
  architect?: Architect;
  sourceRoot?: string;
  root?: string;
}

interface Workspace {
  projects: {
    [key: string]: ProjectDefinition;
  };
}

interface MergeConflict {
  path: string;
  targetValue: unknown;
  sourceValue: unknown;
}

/**
 * Returns the first application project in the workspace.
 * @param workspace Current angular workspace object
 * @returns project name and project definition, if available
 */
function getApplicationProject(workspace: Workspace): {projectName: string; project: ProjectDefinition} | null {
  const projects = workspace?.projects || {};

  for (const key in projects) {
    if (projects[key].projectType === 'application') {
      return {
        projectName: key,
        project: projects[key]
      };
    }
  }

  return null;
}

/**
 * Resolves the source root of the application project.
 * Falls back to /src if no sourceRoot is configured.
 * @param project Project definition
 * @returns Absolute path to the source root
 */
function getSourceRoot(project: ProjectDefinition): string {
  if (project.sourceRoot) {
    return `/${project.sourceRoot.replace(/^\/+/, '')}`;
  }

  return '/src';
}

/**
 * Ensures a file exists with the given content.
 * Does not overwrite existing files.
 * @param tree Virtual file tree
 * @param filePath Absolute file path
 * @param content File content
 */
function ensureFile(tree: Tree, filePath: string, content: string): void {
  if (!tree.exists(filePath)) {
    tree.create(filePath, content);
  }
}

/**
 * Checks whether a value is a plain object.
 * @param value Value to check
 * @returns True if value is a plain object
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Adds a merge conflict entry.
 * @param conflicts Collected merge conflicts
 * @param path Conflict path
 * @param targetValue Existing consumer value
 * @param sourceValue Incoming library value
 */
function addConflict(conflicts: MergeConflict[], path: string, targetValue: unknown, sourceValue: unknown): void {
  conflicts.push({
    path: path || '(root)',
    targetValue,
    sourceValue
  });
}

/**
 * Checks whether two arrays differ.
 * @param targetValue Existing value
 * @param sourceValue Incoming value
 * @returns True if both are arrays and differ
 */
function areDifferentArrays(targetValue: unknown, sourceValue: unknown): boolean {
  return (
    Array.isArray(targetValue) &&
    Array.isArray(sourceValue) &&
    JSON.stringify(targetValue) !== JSON.stringify(sourceValue)
  );
}

/**
 * Merges two non-object leaf values.
 * Keeps the existing consumer value on conflicts.
 * @param target Existing consumer value
 * @param source Incoming library value
 * @param currentPath Current object path
 * @param conflicts Collected merge conflicts
 * @returns Merged value
 */
function mergeLeafValue(target: unknown, source: unknown, currentPath: string, conflicts: MergeConflict[]): unknown {
  if (target === undefined) {
    return source;
  }

  if (source !== undefined && target !== source) {
    addConflict(conflicts, currentPath, target, source);
  }

  return target;
}

/**
 * Handles merge logic for non-object child values.
 * Existing consumer values are preserved on conflicts.
 * @param result Current result object
 * @param key Current property key
 * @param targetValue Existing consumer value
 * @param sourceValue Incoming library value
 * @param nextPath Current object path
 * @param conflicts Collected merge conflicts
 */
function mergeNonObjectProperty(
  result: Record<string, unknown>,
  key: string,
  targetValue: unknown,
  sourceValue: unknown,
  nextPath: string,
  conflicts: MergeConflict[]
): void {
  if (targetValue === undefined) {
    result[key] = sourceValue;
    return;
  }

  if (areDifferentArrays(targetValue, sourceValue)) {
    addConflict(conflicts, nextPath, targetValue, sourceValue);
    return;
  }

  if (!Array.isArray(targetValue) && !Array.isArray(sourceValue) && targetValue !== sourceValue) {
    addConflict(conflicts, nextPath, targetValue, sourceValue);
  }
}

/**
 * Deeply merges two JSON-like objects.
 * Existing consumer values are preserved on conflicts.
 * New library keys are added.
 * Conflicts are collected for optional logging.
 * @param target Existing consumer object
 * @param source Library object to merge into target
 * @param currentPath Current object path for conflict reporting
 * @param conflicts Collected merge conflicts
 * @returns Deep merged object
 */
function deepMergeWithConflicts(
  target: unknown,
  source: unknown,
  currentPath = '',
  conflicts: MergeConflict[] = []
): unknown {
  if (!isPlainObject(target) || !isPlainObject(source)) {
    return mergeLeafValue(target, source, currentPath, conflicts);
  }

  const result: Record<string, unknown> = {...target};

  for (const key of Object.keys(source)) {
    const targetValue = result[key];
    const sourceValue = source[key];
    const nextPath = currentPath ? `${currentPath}.${key}` : key;

    if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
      result[key] = deepMergeWithConflicts(targetValue, sourceValue, nextPath, conflicts);
      continue;
    }

    mergeNonObjectProperty(result, key, targetValue, sourceValue, nextPath, conflicts);
  }

  return result;
}

/**
 * Parses a JSON buffer into an unknown value.
 * @param fileContent File content buffer
 * @param filePath Path used for error reporting
 * @returns Parsed JSON value
 * @throws {SchematicsException} if JSON parsing fails
 */
function parseJsonFile(fileContent: Buffer, filePath: string): unknown {
  try {
    return JSON.parse(fileContent.toString('utf-8')) as unknown;
  } catch {
    throw new SchematicsException(`❌ Could not parse JSON file '${filePath}'.`);
  }
}

/**
 * Logs translation conflicts with a sensible limit.
 * @param context Schematic context
 * @param language Current language file name
 * @param conflicts Collected merge conflicts
 */
function logTranslationConflicts(context: SchematicContext, language: string, conflicts: MergeConflict[]): void {
  if (conflicts.length === 0) {
    return;
  }

  context.logger.warn(
    `⚠ Detected ${conflicts.length} translation conflict(s) in '${language}'. Existing consumer values were kept.`
  );

  const conflictsToLog = conflicts.slice(0, MAX_LOGGED_TRANSLATION_CONFLICTS);

  for (const conflict of conflictsToLog) {
    context.logger.warn(
      `  - Conflict at '${conflict.path}': keeping existing value instead of overwriting with library value.`
    );
  }

  if (conflicts.length > MAX_LOGGED_TRANSLATION_CONFLICTS) {
    context.logger.warn(
      `  - ... and ${conflicts.length - MAX_LOGGED_TRANSLATION_CONFLICTS} more conflict(s) not shown.`
    );
  }
}

/**
 * Add necessary global styles for isy-angular-widgets to the angular workspace.
 * @param workspace Current angular workspace object
 * @param context Schematic context
 * @param tree Virtual file tree
 * @returns Updated tree
 */
function applyStylesToWorkspace(workspace: Workspace, context: SchematicContext, tree: Tree): Tree {
  const appProjectResult = getApplicationProject(workspace);

  if (!appProjectResult) {
    context.logger.warn('⚠ Skipping add styles: Workspace does not contain any project of type application.');
    return tree;
  }

  const {projectName, project} = appProjectResult;

  if (!project?.architect?.build?.options) {
    context.logger.warn(`⚠ Skipping add styles: Missing architect configuration on project ${projectName}.`);
    return tree;
  }

  const sourceRoot = getSourceRoot(project);
  const styles = [
    `${sourceRoot.slice(1)}/tailwind.css`,
    'node_modules/primeicons/primeicons.css',
    'node_modules/@isyfact/isy-angular-widgets/assets/theme/isyfact-theme.scss'
  ];

  const buildOptions = project.architect.build.options;

  if (Array.isArray(buildOptions.styles)) {
    buildOptions.styles = [...new Set(buildOptions.styles.concat(styles))];
  } else {
    buildOptions.styles = styles;
  }

  tree.overwrite('/angular.json', JSON.stringify(workspace, null, JSON_INDENT_SPACES));
  context.logger.info('√ Added isy-angular-widgets styles.');

  return tree;
}

/**
 * Adds the specified assets path to the assets array of the first application project
 * found in the provided Angular workspace configuration. If the assets array does not exist, it is initialized.
 * If the assets path is already present, no changes are made.
 * @param workspace Angular workspace configuration object
 * @param context Schematic context
 * @param tree Virtual file tree
 * @returns Updated tree
 */
function applyAssetsToWorkspace(workspace: Workspace, context: SchematicContext, tree: Tree): Tree {
  const appProjectResult = getApplicationProject(workspace);

  if (!appProjectResult) {
    context.logger.warn('⚠ Skipping: No application project found.');
    return tree;
  }

  const {project} = appProjectResult;

  if (!project?.architect?.build?.options) {
    context.logger.warn('⚠ Skipping: Missing build options in application project.');
    return tree;
  }

  const sourceRoot = getSourceRoot(project);
  const assetsPath = `${sourceRoot.slice(1)}/assets`;
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

  tree.overwrite('/angular.json', JSON.stringify(workspace, null, JSON_INDENT_SPACES));
  return tree;
}

/**
 * Loads the angular workspace from angular.json.
 * @param tree Virtual file tree
 * @returns Workspace structure of angular.json
 * @throws {SchematicsException} if workspace is not available
 */
function loadWorkspace(tree: Tree): Workspace {
  const workspaceConfig = tree.read('/angular.json');

  if (!workspaceConfig) {
    throw new SchematicsException('❌ Could not find Angular workspace configuration.');
  }

  try {
    return JSON.parse(workspaceConfig.toString()) as Workspace;
  } catch {
    throw new SchematicsException('❌ Could not parse Angular workspace configuration.');
  }
}

/**
 * Creates the Tailwind entry CSS file in the consumer application if it does not exist yet.
 * @param workspace Current angular workspace object
 * @param context Schematic context
 * @param tree Virtual file tree
 */
function createTailwindEntryFile(workspace: Workspace, context: SchematicContext, tree: Tree): void {
  const appProjectResult = getApplicationProject(workspace);

  if (!appProjectResult) {
    context.logger.warn('⚠ Skipping Tailwind entry file creation: No application project found.');
    return;
  }

  const {project} = appProjectResult;
  const sourceRoot = getSourceRoot(project);
  const tailwindFilePath = `${sourceRoot}/tailwind.css`;

  const tailwindFileContent = [
    '@import "tailwindcss";',
    '@plugin "tailwindcss-primeui";',
    '@source "../node_modules/@isyfact/isy-angular-widgets";',
    ''
  ].join('\n');

  ensureFile(tree, tailwindFilePath, tailwindFileContent);
  context.logger.info(`√ Ensured Tailwind entry file exists at '${tailwindFilePath}'.`);
}

/**
 * Creates the PostCSS configuration required for Tailwind.
 * @param context Schematic context
 * @param tree Virtual file tree
 */
function createPostCssConfig(context: SchematicContext, tree: Tree): void {
  const postCssConfigPath = '/.postcssrc.json';
  const postCssConfig = {
    plugins: {
      '@tailwindcss/postcss': {}
    }
  };

  if (!tree.exists(postCssConfigPath)) {
    tree.create(postCssConfigPath, JSON.stringify(postCssConfig, null, JSON_INDENT_SPACES));
    context.logger.info('√ Created .postcssrc.json.');
    return;
  }

  const existingContent = tree.read(postCssConfigPath);

  if (!existingContent) {
    throw new SchematicsException('❌ Could not read existing .postcssrc.json.');
  }

  const parsedConfig = parseJsonFile(existingContent, postCssConfigPath) as {
    plugins?: Record<string, unknown>;
  };

  parsedConfig.plugins = parsedConfig.plugins ?? {};

  if (!('@tailwindcss/postcss' in parsedConfig.plugins)) {
    parsedConfig.plugins['@tailwindcss/postcss'] = {};
    tree.overwrite(postCssConfigPath, JSON.stringify(parsedConfig, null, JSON_INDENT_SPACES));
    context.logger.info('√ Updated .postcssrc.json with @tailwindcss/postcss.');
  }
}

/**
 * Creates or updates a translation file for the given language.
 * Missing library keys are added. Existing consumer values are preserved.
 * @param workspace Current angular workspace object
 * @param context Schematic context
 * @param tree Virtual file tree
 * @param language Current language file name
 * @throws {SchematicsException} if translation file does not exist or is empty
 */
export function addTranslationFile(
  workspace: Workspace,
  context: SchematicContext,
  tree: Tree,
  language: string
): void {
  const appProjectResult = getApplicationProject(workspace);

  if (!appProjectResult) {
    context.logger.warn(`⚠ Skipping translation file creation for '${language}': No application project found.`);
    return;
  }

  const {project} = appProjectResult;
  const sourceRoot = getSourceRoot(project);
  const libraryTranslationPath = `./node_modules/@isyfact/isy-angular-widgets/assets/i18n/${language}`;
  const translationFilePath = `${sourceRoot}/assets/i18n/${language}`;

  const isyTranslation = tree.read(libraryTranslationPath);

  if (!isyTranslation) {
    throw new SchematicsException('❌ Could not find isy-angular-widgets translation file.');
  }

  if (!tree.exists(translationFilePath)) {
    tree.create(translationFilePath, isyTranslation.toString('utf-8'));
    context.logger.info(`√ Added language file '${language}'.`);
    return;
  }

  const translation = tree.read(translationFilePath);

  if (!translation) {
    throw new SchematicsException(`❌ Could not read file ${translationFilePath}.`);
  }

  const translationJson = parseJsonFile(translation, translationFilePath);
  const isyTranslationJson = parseJsonFile(isyTranslation, libraryTranslationPath);

  const conflicts: MergeConflict[] = [];
  const mergedTranslation = deepMergeWithConflicts(translationJson, isyTranslationJson, '', conflicts);

  tree.overwrite(translationFilePath, JSON.stringify(mergedTranslation, null, JSON_INDENT_SPACES));
  context.logger.info(`√ Added missing language keys for '${language}' to existing language file.`);

  logTranslationConflicts(context, language, conflicts);
}

/**
 * Installs isy-angular-widgets as dependency and adds the necessary styles and Tailwind setup to the workspace.
 * @returns Rule
 */
export function ngAdd(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const workspace = loadWorkspace(tree);

    addTranslationFile(workspace, context, tree, 'de.json');
    addTranslationFile(workspace, context, tree, 'en.json');

    // Required runtime dependencies
    addPackageToPackageJson(tree, '@angular/common', '^21.1.4');
    addPackageToPackageJson(tree, '@angular/core', '^21.1.4');
    addPackageToPackageJson(tree, 'primeicons', '^7.0.0');
    addPackageToPackageJson(tree, 'primeng', '^21.1.3');
    addPackageToPackageJson(tree, '@primeuix/themes', '^2.0.3');
    addPackageToPackageJson(tree, 'tailwindcss-primeui', '^0.6.1');

    // Required build dependencies
    addDevPackageToPackageJson(tree, 'tailwindcss', '^4.1.4');
    addDevPackageToPackageJson(tree, '@tailwindcss/postcss', '^4.1.4');
    addDevPackageToPackageJson(tree, 'postcss', '^8.4.49');

    createTailwindEntryFile(workspace, context, tree);
    createPostCssConfig(context, tree);
    applyStylesToWorkspace(workspace, context, tree);
    applyAssetsToWorkspace(workspace, context, tree);

    // Install dependencies after all package.json modifications are done
    context.addTask(new NodePackageInstallTask());

    return tree;
  };
}
