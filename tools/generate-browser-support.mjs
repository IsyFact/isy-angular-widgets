import {createRequire} from 'node:module';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const require = createRequire(import.meta.url);
const browserslist = require('browserslist');

const FILE_NAME = fileURLToPath(import.meta.url);
const DIRECTORY_NAME = path.dirname(FILE_NAME);
const ROOT_DIRECTORY = path.resolve(DIRECTORY_NAME, '..');

const PACKAGE_JSON_PATH = path.join(ROOT_DIRECTORY, 'package.json');
const OUTPUT_PATH = path.join(
  ROOT_DIRECTORY,
  'projects/isy-angular-widgets/src/lib/browser-support/browser-support.config.json'
);

const ANGULAR_BASELINE_DATES = {
  21: '2025-10-20',
  22: '2026-05-07'
};

const ANGULAR_BROWSERSLIST = [
  'last 2 Chrome versions',
  'last 1 Firefox version',
  'last 2 Edge major versions',
  'last 2 Safari major versions',
  'last 2 iOS major versions',
  'last 2 Android major versions',
  'Firefox ESR'
];

const TARGET_BROWSERS = {
  chrome: {
    browserslistName: 'chrome',
    label: 'Google Chrome'
  },
  edge: {
    browserslistName: 'edge',
    label: 'Microsoft Edge'
  },
  firefox: {
    browserslistName: 'firefox',
    label: 'Mozilla Firefox'
  },
  safari: {
    browserslistName: 'safari',
    label: 'Apple Safari'
  }
};

async function main() {
  const packageJson = await readJson(PACKAGE_JSON_PATH);
  const angularMajor = getAngularMajorVersion(packageJson);
  const baselineDate = ANGULAR_BASELINE_DATES[angularMajor];

  if (!baselineDate) {
    throw new Error(
      `No baseline date configured for Angular major version ${angularMajor}. ` +
        'Please update ANGULAR_BASELINE_DATES in tools/generate-browser-support.mjs.'
    );
  }

  const resolvedBrowsers = browserslist(ANGULAR_BROWSERSLIST);
  const browsers = createBrowserSupportConfig(resolvedBrowsers);

  const browserSupportConfig = {
    angularMajor,
    baselineDate,
    source: `Generated from Angular browser support rules for Angular ${angularMajor}.`,
    browsers
  };

  await mkdir(path.dirname(OUTPUT_PATH), {recursive: true});
  await writeFile(OUTPUT_PATH, `${JSON.stringify(browserSupportConfig, null, 2)}\n`, 'utf8');

  console.log(`Browser support configuration generated: ${path.relative(ROOT_DIRECTORY, OUTPUT_PATH)}`);
  console.log('');
  console.log('Resolved Browserslist:');
  resolvedBrowsers.forEach((browser) => console.log(`- ${browser}`));
}

async function readJson(filePath) {
  const fileContent = await readFile(filePath, 'utf8');

  return JSON.parse(fileContent);
}

function getAngularMajorVersion(packageJson) {
  const angularCoreVersion =
    packageJson.dependencies?.['@angular/core'] ??
    packageJson.devDependencies?.['@angular/core'] ??
    packageJson.peerDependencies?.['@angular/core'];

  if (!angularCoreVersion) {
    throw new Error('Could not find @angular/core in package.json.');
  }

  const match = angularCoreVersion.match(/\d+/);

  if (!match) {
    throw new Error(`Could not determine Angular major version from "${angularCoreVersion}".`);
  }

  return Number.parseInt(match[0], 10);
}

function createBrowserSupportConfig(resolvedBrowsers) {
  return Object.entries(TARGET_BROWSERS).reduce((config, [browserKey, browser]) => {
    const versions = resolvedBrowsers
      .map((entry) => parseBrowserslistEntry(entry, browser.browserslistName))
      .filter((version) => version !== undefined);

    if (versions.length === 0) {
      throw new Error(`No version found for ${browser.browserslistName} in Browserslist result.`);
    }

    config[browserKey] = {
      label: browser.label,
      minimumVersion: getMinimumVersion(versions)
    };

    return config;
  }, {});
}

function parseBrowserslistEntry(entry, browserName) {
  const [name, version] = entry.split(' ');

  if (name !== browserName || !version || version === 'all') {
    return undefined;
  }

  return normalizeVersion(version);
}

function normalizeVersion(version) {
  return version.split('-')[0];
}

function getMinimumVersion(versions) {
  return versions.sort(compareVersions)[0];
}

function compareVersions(firstVersion, secondVersion) {
  const firstParts = toVersionParts(firstVersion);
  const secondParts = toVersionParts(secondVersion);
  const maxLength = Math.max(firstParts.length, secondParts.length);

  for (let index = 0; index < maxLength; index++) {
    const firstPart = firstParts[index] ?? 0;
    const secondPart = secondParts[index] ?? 0;

    if (firstPart !== secondPart) {
      return firstPart - secondPart;
    }
  }

  return 0;
}

function toVersionParts(version) {
  return version.split('.').map((part) => {
    const parsedPart = Number.parseInt(part, 10);

    return Number.isNaN(parsedPart) ? 0 : parsedPart;
  });
}

try {
  await main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
