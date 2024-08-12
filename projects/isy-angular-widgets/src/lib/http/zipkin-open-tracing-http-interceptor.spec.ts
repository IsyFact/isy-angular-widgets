import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {MockBuilder, MockRender, NG_MOCKS_INTERCEPTORS, ngMocks} from 'ng-mocks';
import {HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {ZipkinOpenTracingHttpInterceptor} from './zipkin-open-tracing-http-interceptor';
import {OpenTraceHeaders} from './open-tracing-headers';

@NgModule({
  providers: [
    ZipkinOpenTracingHttpInterceptor,
    provideHttpClient(withInterceptorsFromDi()),
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: ZipkinOpenTracingHttpInterceptor
    }
  ]
})
class TargetModule {}

describe('Unit tests: ZipkinOpenTracingHttpInterceptor', () => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const URL = '/any-url';

  beforeEach(async () => {
    return MockBuilder(ZipkinOpenTracingHttpInterceptor, TargetModule)
      .exclude(NG_MOCKS_INTERCEPTORS)
      .keep(HTTP_INTERCEPTORS)
      .provide([provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]);
  });

  it('should add Zipkin traceId header', () => {
    MockRender();

    const client = ngMocks.findInstance(HttpClient);
    const httpMock = ngMocks.findInstance(HttpTestingController);

    client.get(URL).subscribe();

    const req = httpMock.expectOne(URL);
    req.flush('');
    httpMock.verify();

    expect(req.request.headers.has(OpenTraceHeaders.ZIPKIN_TRACE_ID)).toBeTruthy();
    expect(req.request.headers.get(OpenTraceHeaders.ZIPKIN_TRACE_ID)).toMatch(uuidRegex);
  });

  it('should add span id header', () => {
    MockRender();

    const client = ngMocks.findInstance(HttpClient);
    const httpMock = ngMocks.findInstance(HttpTestingController);

    client.get(URL).subscribe();

    const req = httpMock.expectOne(URL);
    req.flush('');
    httpMock.verify();

    expect(req.request.headers.has(OpenTraceHeaders.ZIPKIN_SPAN_ID)).toBeTruthy();
    expect(req.request.headers.get(OpenTraceHeaders.ZIPKIN_SPAN_ID)).toMatch(uuidRegex);
  });

  it('should use different ids for trace and span header', () => {
    MockRender();

    const client = ngMocks.findInstance(HttpClient);
    const httpMock = ngMocks.findInstance(HttpTestingController);

    client.get(URL).subscribe();

    const req = httpMock.expectOne(URL);
    req.flush('');
    httpMock.verify();

    const traceId = req.request.headers.get(OpenTraceHeaders.ZIPKIN_TRACE_ID);
    const spanId = req.request.headers.get(OpenTraceHeaders.ZIPKIN_SPAN_ID);

    expect(traceId).not.toEqual(spanId);
  });
});
