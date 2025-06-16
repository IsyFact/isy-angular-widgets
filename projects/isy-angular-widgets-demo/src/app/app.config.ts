import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideIsyFactTheme} from '@isy-angular-widgets/core/providers';
import {HttpClient, provideHttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, provideTranslateService} from '@ngx-translate/core';
import {provideAnimations} from '@angular/platform-browser/animations';

/**
 * Factory function to create a new instance of `TranslateHttpLoader` for ngx-translate.
 * @param http - The Angular `HttpClient` used to fetch translation files.
 * @returns A `TranslateHttpLoader` configured to load translation JSON files from the `./assets/i18n/` directory.
 */
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideAnimations(),
    provideIsyFactTheme(),
    provideHttpClient(),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
};
