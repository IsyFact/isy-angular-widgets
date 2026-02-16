import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {CorrelationIdHttpInterceptor} from './correlation-id-http-interceptor';

describe('Unit tests: CorrelationIdHttpInterceptor', () => {
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const X_CORRELATION_ID = 'x-correlation-id';
  const URL = '/any-url';

  let client: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // makes the test stable even if randomUUID is missing or behaves differently in the environment
    if (!globalThis.crypto) {
      // @ts-expect-error - minimal polyfill for test
      globalThis.crypto = {};
    }
    spyOn(globalThis.crypto, 'randomUUID').and.returnValue('123e4567-e89b-12d3-a456-426614174000');

    TestBed.configureTestingModule({
      providers: [
        {provide: HTTP_INTERCEPTORS, useClass: CorrelationIdHttpInterceptor, multi: true},
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

  it('should add correlation id header', () => {
    client.get(URL).subscribe();

    const req = httpMock.expectOne(URL);

    expect(req.request.headers.has(X_CORRELATION_ID)).toBeTrue();
    expect(req.request.headers.get(X_CORRELATION_ID)).toMatch(UUID_REGEX);

    req.flush('');
  });

  it('should use crypto.randomUUID result as header value', () => {
    client.get(URL).subscribe();

    const req = httpMock.expectOne(URL);

    expect(req.request.headers.get(X_CORRELATION_ID)).toBe('123e4567-e89b-12d3-a456-426614174000');

    req.flush('');
  });
});
