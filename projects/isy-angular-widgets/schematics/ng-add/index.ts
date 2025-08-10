import {Rule, SchematicContext, SchematicsException, Tree} from '@angular-devkit/schematics';
import {NodePackageInstallTask} from '@angular-devkit/schematics/tasks';
import {addPackageToPackageJson} from './package-config';

// Node Buffer (isyTranslation) is not supported in Browser context but schematics is executed with node and not with browser
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

interface MyBuild {
  options: {
    styles: string[];
    assets?: (string | {input: string})[];
  };
}

interface Architect {
  build: MyBuild;
}

interface Workspace {
  projects: {
    [key: string]: {
      projectType: string;
      architect: Architect;
    };
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
 * @throws SchematicsException if workspace is not available
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
 * @throws SchematicsException if translation file does not exist or is empty
 */
export function addTranslationFile(context: SchematicContext, tree: Tree, language: string): void {
  const isyTranslation = tree.read('./node_modules/@isyfact/isy-angular-widgets/assets/i18n/' + language);
  const translationFilePath = '/src/assets/i18n/' + language;

  if (!isyTranslation) {
    throw new SchematicsException('❌ Could not find isy-angular-widgets translation file.');
  }

  if (!tree.exists(translationFilePath)) {
    tree.create(translationFilePath, isyTranslation.toString('utf-8'));
    context.logger.info('√ Add language files (de, en) for isy-angular-widgets.');
  } else {
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
  }
}

/**
 * Installs isy-angular-widgets as dependency and adds the necessary styles to the workspace.
 * @returns Rule
 */
export function ngAdd(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    addTranslationFile(context, tree, 'de.json');
    addTranslationFile(context, tree, 'en.json');

    // Add necessary dependencies to new CLI project.

    addPackageToPackageJson(tree, '@angular/common', '^20.1.6');
    addPackageToPackageJson(tree, '@angular/core', '^20.1.6');
    addPackageToPackageJson(tree, 'primeicons', '^7.0.0');
    addPackageToPackageJson(tree, 'primeng', '^20.0.1');
    addPackageToPackageJson(tree, '@primeuix/themes', '^1.2.3');
    addPackageToPackageJson(tree, 'primeflex', '^4.0.0');
    addPackageToPackageJson(tree, 'moment', '^2.30.1');

    // Install isy-angular-widgets
    context.addTask(new NodePackageInstallTask());

    const workspace = loadWorkspace(tree);

    applyStylesToWorkspace(workspace, context, tree);
    return applyAssetsToWorkspace(workspace, context, tree);
  };
}
