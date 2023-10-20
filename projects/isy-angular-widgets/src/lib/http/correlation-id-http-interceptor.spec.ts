import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CorrelationIdHttpInterceptor} from './correlation-id-http-interceptor';
import {MockBuilder, MockRender, NG_MOCKS_INTERCEPTORS, ngMocks} from 'ng-mocks';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    CorrelationIdHttpInterceptor,
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useExisting: CorrelationIdHttpInterceptor
    }
  ]
})
class TargetModule {}

describe('Unit tests: CorrelationIdHttpInterceptor', () => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const X_CORRELATION_ID = 'x-correlation-id';
  const url = '/any-url';

  beforeEach(async () => {
    return MockBuilder(CorrelationIdHttpInterceptor, TargetModule)
      .exclude(NG_MOCKS_INTERCEPTORS)
      .keep(HTTP_INTERCEPTORS)
      .replace(HttpClientModule, HttpClientTestingModule);
  });

  it('should add correlation id header', () => {
    MockRender();

    const client = ngMocks.findInstance(HttpClient);
    const httpMock = ngMocks.findInstance(HttpTestingController);

    client.get(url).subscribe();

    const req = httpMock.expectOne(url);
    req.flush('');
    httpMock.verify();

    expect(req.request.headers.has(X_CORRELATION_ID)).toBeTruthy();
    expect(req.request.headers.get(X_CORRELATION_ID)).toMatch(uuidRegex);
  });
});
