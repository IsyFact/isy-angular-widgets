import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {CorrelationIdHttpInterceptor} from './correlation-id-http-interceptor';
import {MockBuilder, MockRender, NG_MOCKS_INTERCEPTORS, ngMocks} from 'ng-mocks';
import {NgModule} from '@angular/core';

@NgModule({
  providers: [
    CorrelationIdHttpInterceptor,
    provideHttpClient(withInterceptorsFromDi()),
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useExisting: CorrelationIdHttpInterceptor
    }
  ]
})
class TargetModule {}

describe('Unit tests: CorrelationIdHttpInterceptor', () => {
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const X_CORRELATION_ID = 'x-correlation-id';
  const URL = '/any-url';

  beforeEach(async () => {
    return MockBuilder(CorrelationIdHttpInterceptor, TargetModule)
      .exclude(NG_MOCKS_INTERCEPTORS)
      .keep(HTTP_INTERCEPTORS)
      .provide([provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]);
  });

  it('should add correlation id header', () => {
    MockRender();

    const client = ngMocks.findInstance(HttpClient);
    const httpMock = ngMocks.findInstance(HttpTestingController);

    client.get(URL).subscribe();

    const req = httpMock.expectOne(URL);
    req.flush('');
    httpMock.verify();

    expect(req.request.headers.has(X_CORRELATION_ID)).toBeTruthy();
    expect(req.request.headers.get(X_CORRELATION_ID)).toMatch(UUID_REGEX);
  });
});
