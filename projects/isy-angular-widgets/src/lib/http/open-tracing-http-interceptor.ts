import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {OpenTraceHeaders} from './open-tracing-headers';


/**
 * An abstract {@link HttpInterceptor} that adds http headers depending on the concrete OpenTracing implementation.
 *
 * The <a href="https://opentracing.io/">OpenTracing Standard</a> is currently not supported by the IsyFact software
 * factory and offers an alternative for the concept of the correlationId
 * (See <a href="https://isyfact.github.io/isyfact-standards-doku/latest/isy-logging/konzept/master.html"> IsyFact documentation</a>)
 *
 * In difference to the correlationId, the OpenTracing standard uses a trace- and a spanId.
 * <ul>
 *   <li><b>traceId:</b> This is an id that is assigned to a single request, job, or action. Something like each unique user initiated web request will have its own traceId.</li>
 *   <li><b>spanId:</b> Tracks a unit of work. Think of a request that consists of multiple steps. Each step could have its own spanId and be tracked individually.</li>
 * </ul>
 *
 *
 * For generating the id the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API">crypto api</a>
 * of the webbrowsers is used.
 */
export abstract class OpenTracingHttpInterceptor implements HttpInterceptor {
  protected readonly traceHeaderName: string;
  protected readonly spanHeaderName: string;

  /**
   * Constructor that configures an interceptor for using OpenTracing headers.
   * @param traceHeader The header to append as tracing header
   * @param spanHeader The header to append as span header
   */
  protected constructor(traceHeader: OpenTraceHeaders, spanHeader: OpenTraceHeaders) {
    this.traceHeaderName = traceHeader;
    this.spanHeaderName = spanHeader;
  }

  /**
   * Appends a random traceId and spanId as header to the given request
   * @param req The request to append to
   * @param next The HttpHandler to pass the request to
   * @returns The result Observable
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const traceId = crypto.randomUUID();
    const spanId = crypto.randomUUID();

    const requestWithCorrelationIdHeader = req.clone({
      setHeaders: {
        [this.traceHeaderName]: traceId,
        [this.spanHeaderName]: spanId
      }
    });

    return next.handle(requestWithCorrelationIdHeader);
  }
}
