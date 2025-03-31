import {EnvironmentProviders, makeEnvironmentProviders} from '@angular/core';
import {provideAnimations} from '@angular/platform-browser/animations';
import {providePrimeNG} from 'primeng/config';
import {defaultTheme} from './theme';

export interface IsyFactThemeConfig {
  theme?: string; // Theme-Objekt (e.g. Material)
}

/**
 * Provides the IsyFact theme configuration and necessary environment providers.
 * @param config - An optional configuration object for the IsyFact theme.
 * Defaults to an empty object if not provided.
 * - `theme`: Specifies the theme preset to use. If not provided, the `defaultTheme` is used.
 * @returns An `EnvironmentProviders` instance that includes animations and PrimeNG theme configuration.
 */
export function provideIsyFactTheme(config: IsyFactThemeConfig = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: config.theme ?? defaultTheme
      }
    })
  ]);
}
