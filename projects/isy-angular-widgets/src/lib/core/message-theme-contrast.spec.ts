import {loadThemeTokens, resolveThemeColor, themeContrast} from '../../test/theme-tokens';

const severities = [
  {severity: 'info', button: 'info', palette: 'sky'},
  {severity: 'success', button: 'success', palette: 'green'},
  {severity: 'warn', button: 'warn', palette: 'orange'},
  {severity: 'error', button: 'danger', palette: 'red'}
];

describe.each(['toast', 'message'])('%s theme contrast', (component) => {
  const colors = loadThemeTokens(['button', 'message', 'toast']);

  it.each(severities)('should map $severity to the light $palette button palette', ({severity, button, palette}) => {
    expect(resolveThemeColor(colors, `--p-${component}-${severity}-background`)).toBe(
      resolveThemeColor(colors, `--p-${palette}-100`)
    );
    expect(resolveThemeColor(colors, `--p-button-${button}-background`)).toBe(
      resolveThemeColor(colors, `--p-${palette}-600`)
    );
  });

  it.each(severities)('should give $severity text at least 4.5:1 contrast', ({severity}) => {
    expect(
      themeContrast(colors, `--p-${component}-${severity}-color`, `--p-${component}-${severity}-background`)
    ).toBeGreaterThanOrEqual(4.5);
  });

  it.each(severities)('should keep the $severity close icon readable on hover', ({severity}) => {
    expect(
      themeContrast(
        colors,
        `--p-${component}-${severity}-color`,
        `--p-${component}-${severity}-close-button-hover-background`
      )
    ).toBeGreaterThanOrEqual(3);
  });

  it.each(severities)('should keep the $severity focus ring visible', ({severity}) => {
    expect(
      themeContrast(
        colors,
        `--p-${component}-${severity}-close-button-focus-ring-color`,
        `--p-${component}-${severity}-background`
      )
    ).toBeGreaterThanOrEqual(3);
  });
});

describe('toast detail contrast', () => {
  const colors = loadThemeTokens(['toast']);

  it.each(severities)('should give $severity details at least 4.5:1 contrast', ({severity}) => {
    expect(
      themeContrast(colors, `--p-toast-${severity}-detail-color`, `--p-toast-${severity}-background`)
    ).toBeGreaterThanOrEqual(4.5);
  });
});
