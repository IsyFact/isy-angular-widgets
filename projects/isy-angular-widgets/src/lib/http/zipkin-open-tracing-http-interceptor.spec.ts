import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {MockBuilder, MockRender, NG_MOCKS_INTERCEPTORS, ngMocks} from 'ng-mocks';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {ZipkinOpenTracingHttpInterceptor} from './zipkin-open-tracing-http-interceptor';
import {OpenTraceHeaders} from './open-tracing-headers';


@NgModule({
  imports: [HttpClientModule],
  providers: [
    ZipkinOpenTracingHttpInterceptor,
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: ZipkinOpenTracingHttpInterceptor
    }
  ]
})
class TargetModule {}

describe('ZipkinOpenTracingHttpInterceptor', () => {

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  beforeEach(async() => {
    return MockBuilder(ZipkinOpenTracingHttpInterceptor, TargetModule)
      .exclude(NG_MOCKS_INTERCEPTORS)
      .keep(HTTP_INTERCEPTORS)
      .replace(HttpClientModule, HttpClientTestingModule);
  });


  it('should add Zipkin traceId header', () => {
    MockRender();

    const client = ngMocks.findInstance(HttpClient);
    const httpMock = ngMocks.findInstance(HttpTestingController);

    client.get('/any-url').subscribe();

    const req = httpMock.expectOne('/any-url');
    req.flush('');
    httpMock.verify();




    expect(req.request.headers.has(OpenTraceHeaders.ZIPKIN_TRACE_ID)).toBeTruthy();
    expect(req.request.headers.get(OpenTraceHeaders.ZIPKIN_TRACE_ID)).toMatch(uuidRegex);

  });

  it('should add span id header', () => {
    MockRender();

    const client = ngMocks.findInstance(HttpClient);
    const httpMock = ngMocks.findInstance(HttpTestingController);

    client.get('/any-url').subscribe();

    const req = httpMock.expectOne('/any-url');
    req.flush('');
    httpMock.verify();

    expect(req.request.headers.has(OpenTraceHeaders.ZIPKIN_SPAN_ID)).toBeTruthy();
    expect(req.request.headers.get(OpenTraceHeaders.ZIPKIN_SPAN_ID)).toMatch(uuidRegex);
  });

  it('should use different ids for trace and span header', () => {
    MockRender();

    const client = ngMocks.findInstance(HttpClient);
    const httpMock = ngMocks.findInstance(HttpTestingController);

    client.get('/any-url').subscribe();

    const req = httpMock.expectOne('/any-url');
    req.flush('');
    httpMock.verify();

    const traceId = req.request.headers.get(OpenTraceHeaders.ZIPKIN_TRACE_ID);
    const spanId = req.request.headers.get(OpenTraceHeaders.ZIPKIN_SPAN_ID);

    expect(traceId).not.toEqual(spanId);
  });

});
