import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideIsyFactTheme} from '@isy-angular-widgets/core/providers';
import {provideHttpClient} from '@angular/common/http';
import {provideTranslateHttpLoader, TranslateHttpLoader} from '@ngx-translate/http-loader';
import {provideTranslateLoader, provideTranslateService} from '@ngx-translate/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideIsyFactTheme(),
    provideHttpClient(),
    provideTranslateService(),
    provideTranslateLoader(TranslateHttpLoader),
    provideTranslateHttpLoader({
      prefix: './assets/i18n/',
      suffix: '.json'
    })
  ]
};
