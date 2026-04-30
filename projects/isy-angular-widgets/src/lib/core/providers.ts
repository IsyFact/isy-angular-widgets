/* eslint-disable @typescript-eslint/no-explicit-any */
import {EnvironmentProviders, makeEnvironmentProviders} from '@angular/core';
import {providePrimeNG} from 'primeng/config';
import {Preset} from '@primeuix/themes/types';
import {definePreset} from '@primeuix/themes';
import Nora from '@primeuix/themes/nora';

export const NoraGrayPreset = definePreset(Nora, {
  semantic: {
    primary: {
      50: '{gray.50}',
      100: '{gray.100}',
      200: '{gray.200}',
      300: '{gray.300}',
      400: '{gray.400}',
      500: '{gray.500}',
      600: '{gray.600}',
      700: '{gray.700}',
      800: '{gray.800}',
      900: '{gray.900}',
      950: '{gray.950}'
    }
  }
});

/**
 * Provides the IsyFact theme for PrimeNG components.
 * @param themePreset The theme preset to use. Default is Nora with gray primary color.
 * @returns An EnvironmentProviders object with the theme configuration.
 */
export function provideIsyFactTheme(themePreset: Preset<any> = NoraGrayPreset): EnvironmentProviders {
  return makeEnvironmentProviders([
    providePrimeNG({
      theme: {
        preset: themePreset,
        options: {
          darkModeSelector: false,
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng, components, utilities, isyfact-theme'
          }
        }
      }
    })
  ]);
}
