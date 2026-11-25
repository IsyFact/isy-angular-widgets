import {TestBed} from '@angular/core/testing';
import {parse} from 'postcss';
import {ButtonStyle} from 'primeng/button';
import {TableStyle} from 'primeng/table';
import {loadThemeTokens, resolveThemeColor, themeContrast} from '../../test/theme-tokens';

describe('sorted datatable header resolved token mappings', () => {
  const colors = loadThemeTokens(['button', 'datatable']);

  it.each([
    ['--p-content-hover-background', 'var(--p-surface-200)'],
    ['--p-surface-200', 'var(--p-slate-200)'],
    ['--p-button-text-secondary-color', 'var(--p-surface-600)'],
    ['--p-surface-600', 'var(--p-slate-600)']
  ])('should preserve the design-token mapping of %s', (token, reference) => {
    expect(colors.get(token)).toBe(reference);
  });

  it.each([
    ['header background', '--p-datatable-header-cell-selected-background', '#e2e8f0'],
    ['header text and sort icon', '--p-datatable-header-cell-selected-color', '#0055b9'],
    ['filter icon', '--p-button-text-secondary-color', '#475569']
  ])('should resolve the %s through the real theme declarations', (_element, token, color) => {
    expect(resolveThemeColor(colors, token)).toBe(color);
  });

  it('should detect insufficient contrast if the selected header foreground becomes white', () => {
    const inaccessibleColors = new Map(colors);
    inaccessibleColors.set('--p-datatable-header-cell-selected-color', '#ffffff');

    expect(
      themeContrast(
        inaccessibleColors,
        '--p-datatable-header-cell-selected-color',
        '--p-datatable-header-cell-selected-background'
      )
    ).toBeLessThan(4.5);
  });
});

describe('PrimeNG style mapping for sorted headers', () => {
  const header = '.p-datatable-thead > tr > th.p-datatable-column-sorted';

  it.each([
    [header, 'background', "dt('datatable.header.cell.selected.background')"],
    [header, 'color', "dt('datatable.header.cell.selected.color')"],
    [`${header} .p-datatable-sort-icon`, 'color', "dt('datatable.header.cell.selected.color')"],
    ['.p-button-text.p-button-secondary', 'color', "dt('button.text.secondary.color')"]
  ])('should bind %s %s to the corresponding design token', (selector, property, token) => {
    const css: unknown = TestBed.runInInjectionContext(() =>
      selector.startsWith('.p-button') ? new ButtonStyle().style : new TableStyle().style
    );
    if (typeof css !== 'string') throw new Error('Missing PrimeNG component styles');
    const declarations: string[] = [];
    parse(css).walkRules((rule) => {
      if (rule.selectors.includes(selector)) {
        rule.walkDecls(property, (declaration) => {
          declarations.push(declaration.value);
        });
      }
    });

    expect(declarations).toEqual([token]);
  });
});

describe('WCAG contrast calculation reference values', () => {
  it.each([
    ['#000000', '#ffffff', 21],
    ['#ffffff', '#ffffff', 1],
    ['#fff', '#000', 21]
  ])('should calculate the reference contrast of %s on %s', (foreground, background, expected) => {
    const colors = new Map([
      ['--foreground', foreground],
      ['--background', background]
    ]);

    expect(themeContrast(colors, '--foreground', '--background')).toBe(expected);
  });
});
