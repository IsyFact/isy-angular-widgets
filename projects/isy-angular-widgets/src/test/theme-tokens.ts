/* eslint-disable @typescript-eslint/no-magic-numbers -- WCAG sRGB luminance and contrast coefficients. */
import {ThemeUtils} from '@primeuix/themes';
import {parse} from 'postcss';
import {compile} from 'sass';
import {NoraGrayPreset} from '../lib/core/providers';

/**
 * Loads the generated light-mode PrimeNG tokens and the IsyFact CSS layer overrides.
 * @param componentNames PrimeNG components whose tokens are needed
 * @returns The effective token declarations
 */
export function loadThemeTokens(componentNames: string[]): Map<string, string> {
  const options = {prefix: 'p', darkModeSelector: false};
  const common = ThemeUtils.getCommon({theme: {preset: NoraGrayPreset, options}});
  const styles = [common.primitive.css, common.semantic.css];
  for (const name of componentNames) {
    const preset = NoraGrayPreset.components?.[name];
    if (!preset) throw new Error(`Missing PrimeNG component: ${name}`);
    styles.push(ThemeUtils.getPreset({name, preset, options}).css);
  }
  const tokens = new Map<string, string>();
  for (const css of styles) {
    if (!css) throw new Error('Missing generated PrimeNG CSS');
    parse(css).walkDecls((declaration) => {
      tokens.set(declaration.prop, declaration.value);
    });
  }
  const theme = parse(compile('projects/isy-angular-widgets/assets/theme/isyfact-theme.scss').css);
  theme.walkAtRules('layer', (layer) => {
    if (layer.params === 'isyfact-theme') {
      layer.walkRules(':root', (rule) => {
        rule.each((node) => {
          if (node.type === 'decl') tokens.set(node.prop, node.value);
        });
      });
    }
  });
  return tokens;
}

/**
 * Resolves a CSS color token through its references.
 * @param tokens The effective theme declarations
 * @param token The CSS custom property to resolve
 * @returns The resolved color
 */
export function resolveThemeColor(tokens: Map<string, string>, token: string): string {
  const value = tokens.get(token);
  if (!value) throw new Error(`Missing theme token: ${token}`);
  const reference = /^var\((--[\w-]+)\)$/.exec(value);
  return reference ? resolveThemeColor(tokens, reference[1]) : value;
}

/**
 * Calculates WCAG relative luminance from an opaque hexadecimal color.
 * @param color The hexadecimal color
 * @returns The relative luminance
 */
function luminance(color: string): number {
  if (!/^#([\da-f]{3}|[\da-f]{6})$/i.test(color)) throw new Error(`Unsupported color: ${color}`);
  const hex = color.length === 4 ? color.slice(1).replace(/./g, '$&$&') : color.slice(1);
  const channels = hex.match(/[\da-f]{2}/gi)!.map((channel) => {
    const value = Number.parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

/**
 * Calculates the WCAG contrast ratio of two effective theme colors.
 * @param tokens The effective theme declarations
 * @param foreground The foreground token
 * @param background The background token
 * @returns The contrast ratio
 */
export function themeContrast(tokens: Map<string, string>, foreground: string, background: string): number {
  const values = [foreground, background].map((token) => luminance(resolveThemeColor(tokens, token)));
  return (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05);
}
