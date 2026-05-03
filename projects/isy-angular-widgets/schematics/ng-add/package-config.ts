/**
 * @license MIT
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {SchematicsException, Tree} from '@angular-devkit/schematics';

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
}

const FILE_NAME = 'package.json';
const JSON_SPACES = 2;

/**
 * Sorts the keys of the given object.
 * @param obj Record to be sorted
 * @returns A new object instance with sorted keys
 */
function sortObjectByKeys(obj: Record<string, string>): Record<string, string> {
  return Object.keys(obj)
    .sort((a, b) => a.localeCompare(b))
    .reduce((result: Record<string, string>, key) => {
      result[key] = obj[key];
      return result;
    }, {});
}

/**
 * Reads and parses package.json from the host tree.
 * @param host Tree containing package.json
 * @returns Parsed package.json or null if the file does not exist
 * @throws {SchematicsException} If package.json cannot be parsed
 */
function readPackageJson(host: Tree): PackageJson | null {
  if (!host.exists(FILE_NAME)) {
    return null;
  }

  let sourceText: string;

  try {
    sourceText = host.readText(FILE_NAME);
  } catch {
    return null;
  }

  try {
    return JSON.parse(sourceText) as PackageJson;
  } catch {
    throw new SchematicsException(`❌ Could not parse '${FILE_NAME}'.`);
  }
}

/**
 * Writes package.json back to the host tree.
 * @param host Tree containing package.json
 * @param packageJson Parsed package.json object
 */
function writePackageJson(host: Tree, packageJson: PackageJson): void {
  host.overwrite(FILE_NAME, JSON.stringify(packageJson, null, JSON_SPACES));
}

/**
 * Adds a package to the given package.json section.
 * @param host Tree containing package.json
 * @param section Target package.json section
 * @param pkg Package name
 * @param version Package version
 * @returns The updated host tree
 */
function addPackageToSection(
  host: Tree,
  section: 'dependencies' | 'devDependencies',
  pkg: string,
  version: string
): Tree {
  const packageJson = readPackageJson(host);

  if (!packageJson) {
    return host;
  }

  const targetSection = (packageJson[section] ??= {});

  if (!targetSection[pkg]) {
    targetSection[pkg] = version;
    packageJson[section] = sortObjectByKeys(targetSection);
    writePackageJson(host, packageJson);
  }

  return host;
}

/**
 * Adds a package to the package.json in the given host tree.
 * @param host Tree with packages and their versions
 * @param pkg The package who gets added to package.json
 * @param version The version of the package
 * @returns The new package.json as Tree
 */
export function addPackageToPackageJson(host: Tree, pkg: string, version: string): Tree {
  return addPackageToSection(host, 'dependencies', pkg, version);
}

/**
 * Adds a package to the devDependencies in the package.json in the given host tree.
 * @param host Tree with packages and their versions
 * @param pkg The package who gets added to package.json devDependencies
 * @param version The version of the package
 * @returns The new package.json as Tree
 */
export function addDevPackageToPackageJson(host: Tree, pkg: string, version: string): Tree {
  return addPackageToSection(host, 'devDependencies', pkg, version);
}

/**
 * Gets the version of the specified package by looking at the package.json in the given tree.
 * Checks dependencies first, then devDependencies.
 * @param tree Tree with packages and their versions
 * @param name The name of the package
 * @returns Null or the package version as a string
 */
export function getPackageVersionFromPackageJson(tree: Tree, name: string): string | null {
  const packageJson = readPackageJson(tree);

  if (!packageJson) {
    return null;
  }

  return packageJson.dependencies?.[name] ?? packageJson.devDependencies?.[name] ?? null;
}

/**
 * Adds a script to the scripts section of package.json if it does not already exist.
 * @param host Tree containing package.json
 * @param scriptName Name of the npm script
 * @param script Script command
 * @returns The updated host tree
 */
export function addScriptToPackageJson(host: Tree, scriptName: string, script: string): Tree {
  const packageJson = readPackageJson(host);

  if (!packageJson) {
    return host;
  }

  packageJson.scripts ??= {};

  if (!packageJson.scripts[scriptName]) {
    packageJson.scripts[scriptName] = script;
    writePackageJson(host, packageJson);
  }

  return host;
}
