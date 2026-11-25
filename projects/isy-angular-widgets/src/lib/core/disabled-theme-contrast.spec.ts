describe('disabled theme contrast', () => {
  const disabledButtonBackground = '#7897ae';
  const disabledButtonText = '#ffffff';
  const disabledFieldBackground = '#ffffff';
  const disabledFieldText = '#86888b';

  const parseHexChannel = (hex: string, start: number): number =>
    Number.parseInt(hex.slice(start, start + 2), 16) / 255;

  const toLinear = (value: number): number => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);

  const relativeLuminance = (hexColor: string): number => {
    const normalized = hexColor.replace('#', '');
    const red = toLinear(parseHexChannel(normalized, 0));
    const green = toLinear(parseHexChannel(normalized, 2));
    const blue = toLinear(parseHexChannel(normalized, 4));

    return red * 0.2126 + green * 0.7152 + blue * 0.0722;
  };

  const contrastRatio = (foreground: string, background: string): number => {
    const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
    const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));

    return (lighter + 0.05) / (darker + 0.05);
  };

  it('should keep disabled button text above the configured contrast threshold', () => {
    expect(contrastRatio(disabledButtonText, disabledButtonBackground)).toBeGreaterThanOrEqual(3);
  });

  it('should keep disabled text-button color above the configured contrast threshold', () => {
    expect(contrastRatio(disabledButtonBackground, '#ffffff')).toBeGreaterThanOrEqual(3);
  });

  it('should keep disabled field text above the configured contrast threshold', () => {
    expect(contrastRatio(disabledFieldText, disabledFieldBackground)).toBeGreaterThanOrEqual(3);
  });
});
