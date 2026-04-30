/* eslint-disable @typescript-eslint/no-explicit-any */
import {provideIsyFactTheme, NoraGrayPreset} from './providers';
import Nora from '@primeuix/themes/nora';

/**
 * Extracts all providers from the input object.
 * @param envProviders The environment providers to process
 * @returns An array of all extracted providers
 */
function extractAllProviders(envProviders: any): any[] {
  const seen = new Set();
  const results: any[] = [];

  /**
   * Recursively extracts all providers from the input object.
   * @param input The input to process
   */
  function recurse(input: any): void {
    if (!input || seen.has(input)) return;

    seen.add(input);

    if (Array.isArray(input)) {
      input.forEach(recurse);
    } else if (typeof input === 'object') {
      if (input.ɵproviders) recurse(input.ɵproviders);
      if (input.provide) results.push(input);
    }
  }

  recurse(envProviders.ɵproviders);
  return results;
}

/**
 * Extracts the PrimeNG configuration provider from the given environment providers.
 * @param envProviders The environment providers to search through
 * @returns The PrimeNG provider or undefined if not found
 */
function getPrimeNgProvider(envProviders: any): any {
  const allProviders = extractAllProviders(envProviders);

  return allProviders.find((provider: any) => provider?.provide?._desc === 'PRIME_NG_CONFIG');
}

describe('provideIsyFactTheme', () => {
  it('should include a provider with the default Nora gray theme preset', () => {
    const result = provideIsyFactTheme();
    const primeNgProvider = getPrimeNgProvider(result);

    expect(primeNgProvider).toBeDefined();
    expect(primeNgProvider!.useValue.theme.preset).toBe(NoraGrayPreset);
  });

  it('should allow overriding the default theme preset', () => {
    const result = provideIsyFactTheme(Nora);
    const primeNgProvider = getPrimeNgProvider(result);

    expect(primeNgProvider).toBeDefined();
    expect(primeNgProvider!.useValue.theme.preset).toBe(Nora);
  });

  it('should configure PrimeNG theme options', () => {
    const result = provideIsyFactTheme();
    const primeNgProvider = getPrimeNgProvider(result);

    expect(primeNgProvider).toBeDefined();
    expect(primeNgProvider!.useValue.theme.options).toEqual({
      darkModeSelector: false,
      cssLayer: {
        name: 'primeng',
        order: 'theme, base, primeng, components, utilities, isyfact-theme'
      }
    });
  });
});
