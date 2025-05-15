/* eslint-disable @typescript-eslint/no-explicit-any */
import {EnvironmentProviders, makeEnvironmentProviders} from '@angular/core';
import {providePrimeNG} from 'primeng/config';
import {Preset} from '@primeng/themes/types';
import Nora from '@primeng/themes/nora';

/**
 * Provides the IsyFact theme for PrimeNG components.
 * @param themePreset The theme preset to use. Default is Nora.
 * @returns An EnvironmentProviders object with the theme configuration.
 */
export function provideIsyFactTheme(themePreset: Preset<any> = Nora): EnvironmentProviders {
  return makeEnvironmentProviders([
    providePrimeNG({
      theme: {
        preset: themePreset,
        options: {
          darkModeSelector: false,
          cssLayer: {
            name: 'primeng',
            order: 'primeng, isyfact-theme'
          }
        }
      }
    })
  ]);
}
