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

const FILE_NAME = 'package.json';

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
 * @param host Tree with packages and their versions
 * @param pkg The package who gets added to package.json
 * @param version The version of the package
 * @returns The new package.json as Tree
 */
export function addPackageToPackageJson(host: Tree, pkg: string, version: string): Tree {
  const spacesNum = 2;
  if (host.exists(FILE_NAME)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const sourceText = host.read(FILE_NAME)!.toString('utf-8') as string;

    const json = JSON.parse(sourceText) as PackageJson;

    if (!json.dependencies) {
      json.dependencies = {};
    }

    if (!json.dependencies[pkg]) {
      json.dependencies[pkg] = version;
      json.dependencies = sortObjectByKeys(json.dependencies);
    }

    host.overwrite(FILE_NAME, JSON.stringify(json, null, spacesNum));
  }

  return host;
}

/**
 * Gets the version of the specified package by looking at the package.json in the given tree.
 * @param tree Tree with packages and their versions
 * @param name The name of the package
 * @returns Null or the package version as a string
 */
export function getPackageVersionFromPackageJson(tree: Tree, name: string): string | null {
  if (!tree.exists(FILE_NAME)) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
  const packageJson = JSON.parse(tree.read(FILE_NAME)!.toString('utf8')) as PackageJson;

  return packageJson.dependencies[name] ? packageJson.dependencies[name] : null;
}
