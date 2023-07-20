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
}

/**
 * Sorts the keys of the given object.
 * @param obj Record to be sorted
 * @returns A new object instance with sorted keys
 */
function sortObjectByKeys(obj: Record<string, string>): Record<string, string> {
  return Object.keys(obj)
    .sort()
    .reduce((result: Record<string, string>, key) => {
      result[key] = obj[key];
      return result;
    }, {});
}

/**
 * Adds a package to the package.json in the given host tree.
 * @param host the host
 * @param pkg the package
 * @param version the package version
 * @returns the host
 */
export function addPackageToPackageJson(host: Tree, pkg: string, version: string): Tree {
  const spacesNum = 2;
  if (host.exists('package.json')) {
    const sourceText = host.read('package.json')!.toString('utf-8');
    const json = JSON.parse(sourceText) as PackageJson;

    if (!json.dependencies) {
      json.dependencies = {};
    }

    if (!json.dependencies[pkg]) {
      json.dependencies[pkg] = version;
      json.dependencies = sortObjectByKeys(json.dependencies);
    }

    host.overwrite('package.json', JSON.stringify(json, null, spacesNum));
  }

  return host;
}

/**
 * Gets the version of the specified package by looking at the package.json in the given tree.
 * @param tree with packages and their versions
 * @param name name of the package
 * @returns null or a string
 */
export function getPackageVersionFromPackageJson(tree: Tree, name: string): string | null {
  if (!tree.exists('package.json')) {
    return null;
  }

  const packageJson = JSON.parse(tree.read('package.json')!.toString('utf8')) as PackageJson;

  return (packageJson.dependencies[name]) ? packageJson.dependencies[name] : null;
}
