/* eslint-disable @typescript-eslint/no-explicit-any */
import {provideIsyFactTheme} from './providers';
import Nora from '@primeng/themes/nora';

describe('provideIsyFactTheme', () => {
  /**
   * Extracts all providers from a given Angular environment providers object.
   * This function recursively traverses the input object to collect all provider definitions,
   * avoiding duplicates by using a `Set` to track already processed items.
   * @param envProviders - The Angular environment providers object to extract providers from.
   * @returns An array of provider definitions extracted from the input object.
   */
  function extractAllProviders(envProviders: any): any[] {
    const seen = new Set();
    const results: any[] = [];

    /**
     * Recursively processes the given input to extract and collect objects with a `provide` property.
     * @param input - The input to process, which can be of any type. It may be an array, an object, or other data types.
     * The function performs the following:
     * - Skips processing if the input is falsy or has already been processed (tracked in the `seen` set).
     * - If the input is an array, it recursively processes each element.
     * - If the input is an object:
     *   - Recursively processes the `ɵproviders` property if it exists.
     *   - Adds the object to the `results` array if it contains a `provide` property.
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

  it('should include a provider with the correct theme preset', () => {
    const result = provideIsyFactTheme();
    const allProviders = extractAllProviders(result);
    const primeNgProvider = allProviders.find(
      (p: any) => p?.provide?._desc === 'PRIME_NG_CONFIG' && p?.useValue?.theme?.preset === Nora
    );

    expect(primeNgProvider).toBeDefined();
    expect(primeNgProvider!.useValue.theme.preset).toEqual(Nora);
  });
});
