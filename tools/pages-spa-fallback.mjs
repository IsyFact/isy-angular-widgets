#!/usr/bin/env node
/*
 * Generates the SPA fallback for the GitHub Pages site.
 *
 *   node tools/pages-spa-fallback.mjs <site-dir> <base-path> [sub-app ...]
 *
 * GitHub Pages only ever serves the 404.html at the root of the site, but it
 * serves it for arbitrarily deep paths. A 404.html inside a subdirectory is
 * ignored. A single root 404.html therefore has to handle the deep links of
 * every version line:
 *
 *   - Root app: the 404.html is a copy of its index.html, so the router picks
 *     up the requested URL directly. No redirect happens.
 *   - Sub app: the request is redirected to that app's real index.html, which
 *     restores the original URL before Angular bootstraps.
 *
 * The dispatcher must only ever live in 404.html and the restorer only in the
 * sub app index.html files, otherwise the two would redirect in a loop.
 */
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const args = process.argv.slice(2);

// The base path is empty for a site published at the domain root, so the
// arguments are counted instead of being checked for truthiness.
if (args.length < 2 || args[0] === '') {
  console.error('Usage: node tools/pages-spa-fallback.mjs <site-dir> <base-path> [sub-app ...]');
  process.exit(1);
}

const [siteDir, rawBasePath, ...subApps] = args;

const segments = rawBasePath.split('/').filter(Boolean).join('/');
const basePath = segments === '' ? '/' : `/${segments}/`;

function injectIntoHead(html, snippet, source) {
  if (!/<head[^>]*>/i.test(html)) {
    throw new Error(`No <head> element found in ${source}`);
  }
  return html.replace(/<head[^>]*>/i, (head) => `${head}\n${snippet}`);
}

const restorer = `    <script>
      // Restores the deep link that the root 404.html handed over in "?p=".
      (function () {
        var match = /[?&]p=([^&]*)/.exec(location.search);
        if (!match) return;
        var rest = location.search.replace(/[?&]p=[^&]*/, '').replace(/^&/, '?');
        var path = location.pathname.replace(/\\/$/, '') + decodeURIComponent(match[1]);
        history.replaceState(null, '', path + rest + location.hash);
      })();
    </script>`;

const dispatcher = `    <script>
      // Routes deep links of the other version lines to their own application.
      (function () {
        var base = ${JSON.stringify(basePath)};
        var apps = ${JSON.stringify(subApps)};
        if (location.pathname.indexOf(base) !== 0) return;
        var rest = location.pathname.slice(base.length);
        for (var i = 0; i < apps.length; i++) {
          var app = apps[i];
          if (rest !== app && rest.indexOf(app + '/') !== 0) continue;
          var deep = rest.slice(app.length).replace(/^\\//, '');
          // The documentation consists of real files, it needs no SPA fallback.
          if (deep.indexOf('documentation/') === 0) return;
          location.replace(
            base + app + '/?p=' + encodeURIComponent('/' + deep) +
            location.search.replace('?', '&') + location.hash
          );
          return;
        }
      })();
    </script>`;

for (const app of subApps) {
  const indexPath = join(siteDir, app, 'index.html');
  if (!existsSync(indexPath)) {
    throw new Error(`Missing sub application index.html: ${indexPath}`);
  }
  writeFileSync(indexPath, injectIntoHead(readFileSync(indexPath, 'utf8'), restorer, indexPath));
  console.log(`Added deep link restorer to ${app}/index.html`);
}

const rootIndexPath = join(siteDir, 'index.html');
if (!existsSync(rootIndexPath)) {
  throw new Error(`Missing root index.html: ${rootIndexPath}`);
}

const fallbackPath = join(siteDir, '404.html');
writeFileSync(fallbackPath, injectIntoHead(readFileSync(rootIndexPath, 'utf8'), dispatcher, rootIndexPath));
console.log(`Wrote ${fallbackPath} dispatching [${subApps.join(', ')}] under ${basePath}`);
