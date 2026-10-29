/* eslint-disable @typescript-eslint/no-explicit-any */
import {EnvironmentProviders, makeEnvironmentProviders} from '@angular/core';
import {providePrimeNG} from 'primeng/config';
import {Preset} from '@primeuix/themes/types';
import {definePreset} from '@primeuix/themes';
import Nora from '@primeuix/themes/nora';

const messageColors = {
  info: {
    background: '{sky.100}',
    borderColor: '{sky.200}',
    color: '{sky.900}',
    closeButton: {
      hoverBackground: '{sky.200}',
      focusRing: {color: '{sky.900}', shadow: 'none'}
    }
  },
  success: {
    background: '{green.100}',
    borderColor: '{green.200}',
    color: '{green.900}',
    closeButton: {
      hoverBackground: '{green.200}',
      focusRing: {color: '{green.900}', shadow: 'none'}
    }
  },
  warn: {
    background: '{orange.100}',
    borderColor: '{orange.200}',
    color: '{orange.900}',
    closeButton: {
      hoverBackground: '{orange.200}',
      focusRing: {color: '{orange.900}', shadow: 'none'}
    }
  },
  error: {
    background: '{red.100}',
    borderColor: '{red.200}',
    color: '{red.900}',
    closeButton: {
      hoverBackground: '{red.200}',
      focusRing: {color: '{red.900}', shadow: 'none'}
    }
  }
};

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
  },
  components: {
    message: {
      colorScheme: {
        light: messageColors
      }
    },
    toast: {
      colorScheme: {
        light: {
          info: {...messageColors.info, detailColor: messageColors.info.color},
          success: {...messageColors.success, detailColor: messageColors.success.color},
          warn: {...messageColors.warn, detailColor: messageColors.warn.color},
          error: {...messageColors.error, detailColor: messageColors.error.color}
        }
      }
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
