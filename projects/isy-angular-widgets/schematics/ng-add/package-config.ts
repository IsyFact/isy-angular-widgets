/**
 * @license MIT
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Tree} from '@angular-devkit/schematics';

interface PackageJson {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
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
 */
function readPackageJson(host: Tree): PackageJson | null {
  if (!host.exists(FILE_NAME)) {
    return null;
  }

  const packageJsonBuffer = host.read(FILE_NAME);

  if (!packageJsonBuffer) {
    return null;
  }

  return JSON.parse(packageJsonBuffer.toString('utf-8')) as PackageJson;
}

/**
 * Adds a package to the package.json in the given host tree.
 * @param host Tree with packages and their versions
 * @param pkg The package who gets added to package.json
 * @param version The version of the package
 * @returns The new package.json as Tree
 */
export function addPackageToPackageJson(host: Tree, pkg: string, version: string): Tree {
  const json = readPackageJson(host);

  if (!json) {
    return host;
  }

  json.dependencies ??= {};

  if (!json.dependencies[pkg]) {
    json.dependencies[pkg] = version;
    json.dependencies = sortObjectByKeys(json.dependencies);
  }

  host.overwrite(FILE_NAME, JSON.stringify(json, null, JSON_SPACES));
  return host;
}

/**
 * Adds a package to the devDependencies in the package.json in the given host tree.
 * @param host Tree with packages and their versions
 * @param pkg The package who gets added to package.json devDependencies
 * @param version The version of the package
 * @returns The new package.json as Tree
 */
export function addDevPackageToPackageJson(host: Tree, pkg: string, version: string): Tree {
  const json = readPackageJson(host);

  if (!json) {
    return host;
  }

  json.devDependencies ??= {};

  if (!json.devDependencies[pkg]) {
    json.devDependencies[pkg] = version;
    json.devDependencies = sortObjectByKeys(json.devDependencies);
  }

  host.overwrite(FILE_NAME, JSON.stringify(json, null, JSON_SPACES));
  return host;
}

/**
 * Gets the version of the specified package by looking at the package.json in the given tree.
 * @param tree Tree with packages and their versions
 * @param name The name of the package
 * @returns Null or the package version as a string
 */
export function getPackageVersionFromPackageJson(tree: Tree, name: string): string | null {
  const packageJson = readPackageJson(tree);

  if (!packageJson) {
    return null;
  }

  return packageJson.dependencies[name] ?? null;
}

/**
 * Adds a script to the scripts section of package.json if it does not already exist.
 * @param host Tree containing package.json
 * @param scriptName Name of the npm script
 * @param script Script command
 * @returns The updated host tree
 */
export function addScriptToPackageJson(host: Tree, scriptName: string, script: string): Tree {
  const json = readPackageJson(host);

  if (!json) {
    return host;
  }

  json.scripts ??= {};

  if (!json.scripts[scriptName]) {
    json.scripts[scriptName] = script;
  }

  host.overwrite(FILE_NAME, JSON.stringify(json, null, JSON_SPACES));
  return host;
}
