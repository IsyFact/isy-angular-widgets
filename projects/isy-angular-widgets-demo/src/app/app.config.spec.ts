import {createSpyObject, SpyObject} from '@ngneat/spectator/vitest';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {TranslateLoader} from '@ngx-translate/core';
import {
  TranslateHttpLoader,
  TRANSLATE_HTTP_LOADER_CONFIG,
  type TranslateHttpLoaderConfig
} from '@ngx-translate/http-loader';

describe('TranslateHttpLoader (DI config)', () => {
  let http: SpyObject<HttpClient>;

  beforeEach(() => {
    http = createSpyObject(HttpClient);
    http.get.mockReturnValue(of({}));

    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: http},
        {provide: TranslateLoader, useClass: TranslateHttpLoader},
        {
          provide: TRANSLATE_HTTP_LOADER_CONFIG,
          useValue: {prefix: './assets/i18n/', suffix: '.json'} satisfies Partial<TranslateHttpLoaderConfig>
        }
      ]
    });
  });

  it('calls ./assets/i18n/en.json', () => {
    const loader = TestBed.inject(TranslateLoader) as TranslateHttpLoader;
    loader.getTranslation('en').subscribe();
    expect(http.get).toHaveBeenCalledWith('./assets/i18n/en.json');
  });
});
