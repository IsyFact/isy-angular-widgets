import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

// Run from the repository root. Audit tools are installed outside the project's dependencies.
const toolsDirectory = resolve(process.argv[2] ?? 'tmp/ifs4982-audit-tools');
const outputDirectory = resolve(process.argv[3] ?? 'tmp/ifs4982-audit');
const require = createRequire(resolve(toolsDirectory, 'package.json'));
const {default: puppeteer} = await import(pathToFileURL(require.resolve('puppeteer-core')));
const {startFlow} = await import(pathToFileURL(require.resolve('lighthouse')));
const baseUrl = process.env.IFS4982_BASE_URL ?? 'http://127.0.0.1:4201';
const sourceFiles = [
  'projects/isy-angular-widgets/assets/theme/isyfact-theme.scss',
  'projects/isy-angular-widgets/assets/theme/_isyfact-variables.scss',
  'projects/isy-angular-widgets/src/lib/core/providers.ts'
];
const sourceHashes = {};
for (const file of sourceFiles)
  sourceHashes[file] = createHash('sha256')
    .update(await readFile(file))
    .digest('hex');
await mkdir(outputDirectory, {recursive: true});

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-first-run', '--disable-extensions'],
  defaultViewport: {width: 1440, height: 1000}
});
const results = {
  issue: 'IFS-4982',
  baseCommit: execFileSync('git', ['rev-parse', 'HEAD'], {encoding: 'utf8'}).trim(),
  sourceHashes,
  chrome: await browser.version(),
  pages: []
};
try {
  for (const [name, route] of [
    ['objekt-suchen', '/objekt-suchen'],
    ['primeng-data', '/primeng-widgets/primeng-data']
  ]) {
    console.log(`Checking ${name}`);
    const page = await browser.newPage();
    await page.goto(`${baseUrl}${route}`, {waitUntil: 'networkidle0'});
    await page.evaluate(() => document.fonts.ready);
    if (name === 'objekt-suchen') {
      await page.locator('#last-name').fill('Mustermann');
      await page.locator('#search-button button').click();
      await page.waitForFunction(() =>
        document.querySelector('.p-datatable-tbody')?.textContent.includes('Mustermann')
      );
    }
    await page.waitForSelector('th.p-datatable-sortable-column', {visible: true});
    const flow = await startFlow(page, {
      name: `IFS-4982 ${name}`,
      config: {
        extends: 'lighthouse:default',
        settings: {
          onlyAudits: ['color-contrast'],
          formFactor: 'desktop',
          screenEmulation: {disabled: true}
        }
      }
    });
    const rendered = [];
    for (const header of await page.$$('th.p-datatable-sortable-column')) {
      for (let direction = 0; direction < 2; direction++) {
        await header.evaluate((element) => element.click());
        await page.mouse.move(0, 0);
        await new Promise((resolve) => setTimeout(resolve, 200));
        const colors = await header.evaluate((element) => {
          const luminance = (color) => {
            const [r, g, b] = color
              .match(/[\d.]+/g)
              .slice(0, 3)
              .map((value) => {
                const channel = Number(value) / 255;
                return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
              });
            return r * 0.2126 + g * 0.7152 + b * 0.0722;
          };
          const style = getComputedStyle(element);
          const tokenColor = (token) => {
            const probe = document.createElement('span');
            probe.style.color = style.getPropertyValue(token);
            document.body.appendChild(probe);
            const color = getComputedStyle(probe).color;
            probe.remove();
            return color;
          };
          const background = style.backgroundColor;
          const filter = element.querySelector('.p-datatable-column-filter-button');
          return {
            header: element.textContent.trim(),
            order: element.getAttribute('aria-sort'),
            background,
            expectedBackground: tokenColor('--p-content-hover-background'),
            secondaryTextFilter:
              filter?.classList.contains('p-button-text') && filter.classList.contains('p-button-secondary'),
            foregrounds: [
              ['text', element, '--p-primary-color', 4.5],
              ['sort', element.querySelector('.p-datatable-sort-icon'), '--p-primary-color', 4.5],
              ['filter', filter?.querySelector('svg'), '--p-button-text-secondary-color', 3]
            ].map(([kind, target, token, minimum]) => {
              if (!target) throw new Error(`Missing ${kind} in ${element.textContent}`);
              const color = getComputedStyle(target).color;
              const a = luminance(color),
                b = luminance(background);
              return {
                kind,
                token,
                color,
                expectedColor: tokenColor(token),
                minimum,
                ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
              };
            })
          };
        });
        rendered.push(colors);
        assert.ok(['ascending', 'descending'].includes(colors.order), JSON.stringify(colors));
        assert.equal(colors.background, colors.expectedBackground);
        assert.equal(colors.secondaryTextFilter, true);
        for (const foreground of colors.foregrounds) {
          assert.equal(foreground.color, foreground.expectedColor);
          assert.ok(foreground.ratio >= foreground.minimum, JSON.stringify(colors));
        }
      }
    }
    await page.screenshot({path: resolve(outputDirectory, `${name}.png`), fullPage: true});
    await flow.snapshot({name: `${name} with sorted column`});
    const flowResult = await flow.createFlowResult();
    const lhr = flowResult.steps[0].lhr;
    await writeFile(resolve(outputDirectory, `${name}-lighthouse.json`), JSON.stringify(flowResult, null, 2));
    await writeFile(resolve(outputDirectory, `${name}-lighthouse.html`), await flow.generateReport());
    results.pages.push({
      name,
      requestedUrl: lhr.requestedUrl,
      fetchTime: lhr.fetchTime,
      lighthouseVersion: lhr.lighthouseVersion,
      userAgent: lhr.userAgent,
      environment: lhr.environment,
      configSettings: lhr.configSettings,
      runWarnings: lhr.runWarnings,
      audit: lhr.audits['color-contrast'],
      rendered
    });
    await page.close();
  }
  await writeFile(resolve(outputDirectory, 'results.json'), JSON.stringify(results, null, 2) + '\n');
  for (const result of results.pages) {
    assert.equal(result.audit.score, 1, `${result.name}: Lighthouse color-contrast must pass`);
    console.log(
      `${result.name}: ${result.rendered.length} sorted states, Lighthouse color-contrast ${result.audit.score}`
    );
  }
} finally {
  await browser.close();
}
