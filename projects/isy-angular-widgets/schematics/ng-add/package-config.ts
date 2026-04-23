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
}

const FILE_NAME = 'package.json';
const JSON_INDENT_SPACES = 2;

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
 * Safely reads a file as UTF-8 string.
 * Encapsulates file reading and decoding from Tree.read().
 * @param host Tree
 * @param fileName File path
 * @returns File content as string or null
 */
function readFileAsUtf8(host: Tree, fileName: string): string | null {
  const fileContent: unknown = host.read(fileName);

  if (!(fileContent instanceof Uint8Array)) {
    return null;
  }

  return new TextDecoder('utf-8').decode(fileContent);
}

/**
 * Reads and parses package.json from the host tree.
 * @param host Tree containing package.json
 * @returns Parsed package.json object or null if file is missing/unreadable
 * @throws {SchematicsException} if package.json exists but contains invalid JSON
 */
function readPackageJson(host: Tree): PackageJson | null {
  if (!host.exists(FILE_NAME)) {
    return null;
  }

  const sourceText = readFileAsUtf8(host, FILE_NAME);

  if (!sourceText) {
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
  host.overwrite(FILE_NAME, JSON.stringify(packageJson, null, JSON_INDENT_SPACES));
}

/**
 * Adds a package to the given section in package.json.
 * @param host Tree with packages and their versions
 * @param section Target section in package.json
 * @param pkg The package name
 * @param version The version of the package
 * @returns The updated tree
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
 * Adds a package to the dependencies section in package.json.
 * @param host Tree with packages and their versions
 * @param pkg The package name
 * @param version The version of the package
 * @returns The updated tree
 */
export function addPackageToPackageJson(host: Tree, pkg: string, version: string): Tree {
  return addPackageToSection(host, 'dependencies', pkg, version);
}

/**
 * Adds a package to the devDependencies section in package.json.
 * @param host Tree with packages and their versions
 * @param pkg The package name
 * @param version The version of the package
 * @returns The updated tree
 */
export function addDevPackageToPackageJson(host: Tree, pkg: string, version: string): Tree {
  return addPackageToSection(host, 'devDependencies', pkg, version);
}

/**
 * Gets the version of the specified package by looking at package.json in the given tree.
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
