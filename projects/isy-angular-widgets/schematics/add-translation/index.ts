/* eslint-disable */
import {Rule, SchematicContext, SchematicsException, Tree} from '@angular-devkit/schematics';
import {NodePackageInstallTask} from '@angular-devkit/schematics/tasks';
import {addPackageToPackageJson, getPackageVersionFromPackageJson} from './package-config';

/**
 * Add translation file and dependencies to new CLI project.
 */
export function addTranslation(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (getPackageVersionFromPackageJson(tree, '@angular/cdk') === null) {

      // Add dependencies to new CLI project.
      addPackageToPackageJson(tree, '@ngx-translate/core', `^14.0.0`);
      addPackageToPackageJson(tree, '@ngx-translate/http-loader', `^7.0.0`);

      // Add a task to run the package manager. This is necessary because we updated the
      // workspace "package.json" file and we want lock files to reflect the new version range.
      context.addTask(new NodePackageInstallTask());
    }

    // Add translation to new CLI project
    addTranslationFile(context, tree, 'de.json');
    addTranslationFile(context, tree, 'en.json');
  };
}

/**
 * Create new translation file or merge if one already exists.
 *
 * @param context
 * @param tree
 * @throw SchematicsException if translation file does not exist or is empty
 */
function addTranslationFile(context: SchematicContext, tree: Tree, language: String) {
  const isyTranslation = tree.read('./node_modules/@isyfact/isy-angular-widgets/assets/i18n/' + language);
  const translationFilePath = '/src/assets/i18n/' + language;

  if (!isyTranslation) {
    throw new SchematicsException('❌ Could not find isy-angular-widgets translation file.');
  }

  if (!tree.exists(translationFilePath)) {
    tree.create(translationFilePath, isyTranslation.toString("utf-8"));
    context.logger.info('✅ Adding isy-angular-widgets translation file to project assets');
  } else {
    const translation = tree.read(translationFilePath);

    if (!translation) throw new SchematicsException('❌ Translation file is empty.');

    let translationJson = JSON.parse(translation.toString('utf-8'));
    const isyTranslationJson = JSON.parse(isyTranslation.toString('utf-8'));

    if (translationJson) {
      translationJson = {...translationJson, ...isyTranslationJson};
      context.logger.info(`✅ Merging isy-angular-widgets translation to ${translationFilePath}`);
    }

    tree.overwrite(translationFilePath, JSON.stringify(translationJson, null, 2));
  } 
}
