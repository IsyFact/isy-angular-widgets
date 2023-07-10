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

      // Add necessary dependencies to new CLI project.
      addPackageToPackageJson(tree, '@ngx-translate/core', `^14.0.0`);
      addPackageToPackageJson(tree, '@ngx-translate/http-loader', `^7.0.0`);

      // Add a task to run the package manager. This is necessary because we updated the
      // workspace "package.json" file, and we want lock files to reflect the new version range.
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
    tree.create(translationFilePath, isyTranslation.toString("utf-8"));
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
