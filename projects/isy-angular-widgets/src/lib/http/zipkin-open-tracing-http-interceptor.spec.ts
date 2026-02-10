import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {ZipkinOpenTracingHttpInterceptor} from './zipkin-open-tracing-http-interceptor';
import {OpenTraceHeaders} from './open-tracing-headers';

describe('Unit tests: ZipkinOpenTracingHttpInterceptor', () => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const URL = '/any-url';

  let client: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    if (!globalThis.crypto) {
      // @ts-expect-error minimal polyfill for test
      globalThis.crypto = {};
    }

    // two different IDs for Trace + Span
    spyOn(globalThis.crypto, 'randomUUID').and.returnValues(
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001'
    );

    TestBed.configureTestingModule({
      providers: [
        {provide: HTTP_INTERCEPTORS, useClass: ZipkinOpenTracingHttpInterceptor, multi: true},
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });

    client = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Zipkin traceId header', () => {
    client.get(URL).subscribe();

    const req = httpMock.expectOne(URL);

    expect(req.request.headers.has(OpenTraceHeaders.ZIPKIN_TRACE_ID)).toBeTrue();
    expect(req.request.headers.get(OpenTraceHeaders.ZIPKIN_TRACE_ID)).toMatch(uuidRegex);

    req.flush('');
  });

  it('should add span id header', () => {
    client.get(URL).subscribe();

    const req = httpMock.expectOne(URL);

    expect(req.request.headers.has(OpenTraceHeaders.ZIPKIN_SPAN_ID)).toBeTrue();
    expect(req.request.headers.get(OpenTraceHeaders.ZIPKIN_SPAN_ID)).toMatch(uuidRegex);

    req.flush('');
  });

  it('should use different ids for trace and span header', () => {
    client.get(URL).subscribe();

    const req = httpMock.expectOne(URL);

    const traceId = req.request.headers.get(OpenTraceHeaders.ZIPKIN_TRACE_ID);
    const spanId = req.request.headers.get(OpenTraceHeaders.ZIPKIN_SPAN_ID);

    expect(traceId).toBeTruthy();
    expect(spanId).toBeTruthy();
    expect(traceId).not.toEqual(spanId);

    req.flush('');
  });

  it('should use crypto.randomUUID results for trace and span', () => {
    client.get(URL).subscribe();

    const req = httpMock.expectOne(URL);

    expect(req.request.headers.get(OpenTraceHeaders.ZIPKIN_TRACE_ID)).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(req.request.headers.get(OpenTraceHeaders.ZIPKIN_SPAN_ID)).toBe('123e4567-e89b-12d3-a456-426614174001');

    req.flush('');
  });
});
