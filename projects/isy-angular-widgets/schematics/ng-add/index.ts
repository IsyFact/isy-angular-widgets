/* eslint-disable */
import {Rule, SchematicContext, SchematicsException, Tree} from '@angular-devkit/schematics';
import {NodePackageInstallTask} from '@angular-devkit/schematics/tasks';
import {addPackageToPackageJson} from './package-config';

/**
 * Installs isy-angular-widgets as dependency and adds the necessary styles to the workspace.
 */
export function ngAdd(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    addTranslationFile(context, tree, 'de.json');
    addTranslationFile(context, tree, 'en.json');

    // Add necessary dependencies to new CLI project.

    addPackageToPackageJson(tree, '@angular/common', '^16.2.10');
    addPackageToPackageJson(tree, '@angular/core', '^16.2.10');
    addPackageToPackageJson(tree, 'primeicons', '^6.0.1');
    addPackageToPackageJson(tree, 'primeng', '^16.5.1');
    addPackageToPackageJson(tree, 'primeflex', '^3.3.1');
    addPackageToPackageJson(tree, 'moment', '^2.29.4');

    // Install isy-angular-widgets
    context.addTask(new NodePackageInstallTask());

    const workspace = loadWorkspace(tree);
    return applyStylesToWorkspace(workspace, context, tree);
  };
}

/**
 * Loads the angular workspace store in angular.json.
 *
 * @param tree
 * @throw SchematicsException if workspace is not available
 */
function loadWorkspace(tree: Tree) {
  const workspaceConfig = tree.read('/angular.json');

  if (!workspaceConfig) {
    throw new SchematicsException('❌ Could not find Angular workspace configuration.');
  }

  return JSON.parse(workspaceConfig.toString());
}

/**
 * Add necessary styles for isy-angular-widgets to the angular workspace.
 *
 * @param workspace Current angular workspace object
 * @param context
 * @param tree
 */
function applyStylesToWorkspace(workspace: any, context: SchematicContext, tree: Tree): Tree {
  const styles = [
    'node_modules/primeicons/primeicons.css',
    'node_modules/primeflex/primeflex.min.css',
    'node_modules/primeng/resources/primeng.min.css',
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

  const angularJson = JSON.stringify(workspace, null, 2);
  tree.overwrite('/angular.json', angularJson);

  context.logger.info('√ Add isy-angular-widgets styles.');

  return tree;
}

/**
 * Create new translation file or merge if one already exists.
 *
 * @param context
 * @param tree
 * @param language
 * @throw SchematicsException if translation file does not exist or is empty
 */
export function addTranslationFile(context: SchematicContext, tree: Tree, language: string) {
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
      context.logger.info(`√ Add language keys (de, en) for isy-angular-widgets to existing language files.`);
    }

    tree.overwrite(translationFilePath, JSON.stringify(translationJson, null, 2));
  }
}
