import {loadThemeTokens, themeContrast} from '../../test/theme-tokens';

describe('sorted datatable header theme contrast', () => {
  const colors = loadThemeTokens(['button', 'datatable']);

  it('should select the neutral background and primary foreground in the isyfact-theme layer', () => {
    expect(colors.get('--p-datatable-header-cell-selected-background')).toBe('var(--p-content-hover-background)');
    expect(colors.get('--p-datatable-header-cell-selected-color')).toBe('var(--p-primary-color)');
  });

  // PrimeNG uses the selected header color for both header text and the sort icon;
  // the column filter is a secondary text button with its own foreground token.
  it.each([
    ['header text', '--p-datatable-header-cell-selected-color', 4.5],
    ['sort icon', '--p-datatable-header-cell-selected-color', 4.5],
    ['filter icon', '--p-button-text-secondary-color', 3]
  ])('should give the %s sufficient contrast against the sorted header', (_element, token, minimum) => {
    expect(themeContrast(colors, token, '--p-datatable-header-cell-selected-background')).toBeGreaterThanOrEqual(
      minimum
    );
  });
});

describe('form placeholder theme contrast', () => {
  const colors = loadThemeTokens(['select', 'inputtext']);

  it.each(['select', 'inputtext'])('should keep %s placeholders readable on the demo search form', (component) => {
    expect(
      themeContrast(colors, `--p-${component}-placeholder-color`, `--p-${component}-background`)
    ).toBeGreaterThanOrEqual(4.5);
  });
});
