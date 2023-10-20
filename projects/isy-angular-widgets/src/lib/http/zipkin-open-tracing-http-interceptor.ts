import {OpenTracingHttpInterceptor} from './open-tracing-http-interceptor';
import {Injectable} from '@angular/core';
import {OpenTraceHeaders} from './open-tracing-headers';

/**
 * Implements the {@link OpenTracingHttpInterceptor} using the <a href="https://zipkin.io/">Zipkin</a> implementation
 * of the OpenTracing standard.
 */
@Injectable()
export class ZipkinOpenTracingHttpInterceptor extends OpenTracingHttpInterceptor {
  /**
   * Constructor that configures an {@link OpenTracingHttpInterceptor} to use ZIPKIN standard
   */
  constructor() {
    super(OpenTraceHeaders.ZIPKIN_TRACE_ID, OpenTraceHeaders.ZIPKIN_SPAN_ID);
  }
}
