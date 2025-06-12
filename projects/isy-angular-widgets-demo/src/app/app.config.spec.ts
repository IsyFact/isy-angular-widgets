import {HttpLoaderFactory} from './app.config';
import {HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

describe('HttpLoaderFactory', () => {
  it('should create a TranslateHttpLoader with correct path and extension', () => {
    const mockHttpClient = {} as HttpClient;
    const loader = HttpLoaderFactory(mockHttpClient);
    expect(loader).toBeInstanceOf(TranslateHttpLoader);
    expect(loader.prefix).toBe('./assets/i18n/');
    expect(loader.suffix).toBe('.json');
  });
});
