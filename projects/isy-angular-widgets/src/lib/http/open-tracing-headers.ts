/**
 * List of supported tracing headers.
 */
export enum OpenTraceHeaders {

  /**
   * Tracing headers for the <a href="https://zipkin.io/pages/instrumenting.html">Zipkin</a> implementation of the
   * OpenTracing standard.
   */
  ZIPKIN_TRACE_ID = 'X-B3-TraceId',
  ZIPKIN_SPAN_ID  = 'X-B3-SpanId'
}
