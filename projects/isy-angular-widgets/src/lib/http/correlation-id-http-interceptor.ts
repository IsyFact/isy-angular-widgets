import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

/**
 * A {@link HttpInterceptor} that appends the x-correlations-id header to each request.
 *
 * The correlation ID must always be logged so that the log entries can be assigned to individual calls and tracked
 * across the components of the application landscape. (See <a href="https://isyfact.github.io/isyfact-standards-doku/latest/isy-logging/konzept/master.html">
 * IsyFact documentation</a>)
 *
 * For generating the id the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API">crypto api</a>
 * of the webbrowsers is used.
 */
@Injectable()
export class CorrelationIdHttpInterceptor implements HttpInterceptor {
  /**
   * Appends a random x-correlation-id as header to the given request
   * @param req The request to append to
   * @param next The HttpHandler to pass the request to
   * @returns The result Observable
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const correlationId = crypto.randomUUID();
    const requestWithCorrelationIdHeader = req.clone({
      setHeaders: {
        'x-correlation-id': correlationId
      }
    });

    return next.handle(requestWithCorrelationIdHeader);
  }
}
