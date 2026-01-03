/**
 * HTTP Status Codes (RFC 9110 — HTTP Semantics)
 *
 * All descriptions are taken verbatim from RFC 9110.
 */
export enum HttpStatus {
	/* =========================
	 * 1xx — Informational
	 * ========================= */

	/**
	 * The 100 (Continue) status code indicates that the initial part of a request
	 * has been received and has not yet been rejected by the server. The server
	 * intends to send a final response after the request has been fully received
	 * and acted upon.
	 */
	CONTINUE = 100,

	/**
	 * The 101 (Switching Protocols) status code indicates that the server
	 * understands and is willing to comply with the client's request, via the
	 * Upgrade header field, to change the application protocol being used on
	 * this connection.
	 */
	SWITCHING_PROTOCOLS = 101,

	/* =========================
	 * 2xx — Successful
	 * ========================= */

	/**
	 * The 200 (OK) status code indicates that the request has succeeded. The
	 * payload sent in a 200 response depends on the request method.
	 */
	OK = 200,

	/**
	 * The 201 (Created) status code indicates that the request has been fulfilled
	 * and has resulted in one or more new resources being created. The primary
	 * resource created by the request is identified by either a Location header
	 * field in the response or, if no Location header field is received, by the
	 * target URI.
	 */
	CREATED = 201,

	/**
	 * The 202 (Accepted) status code indicates that the request has been accepted
	 * for processing, but the processing has not been completed. The request
	 * might or might not eventually be acted upon.
	 */
	ACCEPTED = 202,

	/**
	 * The 203 (Non-Authoritative Information) status code indicates that the
	 * request was successful but the enclosed payload has been modified from
	 * that of the origin server's 200 (OK) response by a transforming proxy.
	 */
	NON_AUTHORITATIVE_INFORMATION = 203,

	/**
	 * The 204 (No Content) status code indicates that the server has successfully
	 * fulfilled the request and that there is no additional content to send in
	 * the response payload body.
	 */
	NO_CONTENT = 204,

	/**
	 * The 205 (Reset Content) status code indicates that the server has fulfilled
	 * the request and desires that the user agent reset the document view which
	 * caused the request to be sent.
	 */
	RESET_CONTENT = 205,

	/**
	 * The 206 (Partial Content) status code indicates that the server is
	 * successfully fulfilling a range request for the target resource.
	 */
	PARTIAL_CONTENT = 206,

	/* =========================
	 * 3xx — Redirection
	 * ========================= */

	/**
	 * The 300 (Multiple Choices) status code indicates that the target resource
	 * has more than one representation, each with its own more specific
	 * identifier.
	 */
	MULTIPLE_CHOICES = 300,

	/**
	 * The 301 (Moved Permanently) status code indicates that the target resource
	 * has been assigned a new permanent URI and any future references to this
	 * resource ought to use one of the enclosed URIs.
	 */
	MOVED_PERMANENTLY = 301,

	/**
	 * The 302 (Found) status code indicates that the target resource resides
	 * temporarily under a different URI.
	 */
	FOUND = 302,

	/**
	 * The 303 (See Other) status code indicates that the server is redirecting the
	 * user agent to a different resource intended to provide an indirect
	 * response to the original request.
	 */
	SEE_OTHER = 303,

	/**
	 * The 304 (Not Modified) status code indicates that a conditional GET or HEAD
	 * request has been received and would have resulted in a 200 (OK) response
	 * if the condition evaluated to true.
	 */
	NOT_MODIFIED = 304,

	/**
	 * The 307 (Temporary Redirect) status code indicates that the target resource
	 * resides temporarily under a different URI and the user agent MUST NOT
	 * change the request method.
	 */
	TEMPORARY_REDIRECT = 307,

	/**
	 * The 308 (Permanent Redirect) status code indicates that the target resource
	 * has been assigned a new permanent URI and the user agent MUST NOT change
	 * the request method.
	 */
	PERMANENT_REDIRECT = 308,

	/* =========================
	 * 4xx — Client Error
	 * ========================= */

	/**
	 * The 400 (Bad Request) status code indicates that the server cannot or will
	 * not process the request due to a client error.
	 */
	BAD_REQUEST = 400,

	/**
	 * The 401 (Unauthorized) status code indicates that the request has not been
	 * applied because it lacks valid authentication credentials.
	 */
	UNAUTHORIZED = 401,

	/**
	 * The 402 (Payment Required) status code is reserved for future use.
	 */
	PAYMENT_REQUIRED = 402,

	/**
	 * The 403 (Forbidden) status code indicates that the server understood the
	 * request but refuses to authorize it.
	 */
	FORBIDDEN = 403,

	/**
	 * The 404 (Not Found) status code indicates that the origin server did not
	 * find a current representation for the target resource.
	 */
	NOT_FOUND = 404,

	/**
	 * The 405 (Method Not Allowed) status code indicates that the method specified
	 * in the request is not allowed for the target resource.
	 */
	METHOD_NOT_ALLOWED = 405,

	/**
	 * The 406 (Not Acceptable) status code indicates that the target resource does
	 * not have a current representation acceptable to the user agent.
	 */
	NOT_ACCEPTABLE = 406,

	/**
	 * The 408 (Request Timeout) status code indicates that the server did not
	 * receive a complete request message within the time it was prepared to wait.
	 */
	REQUEST_TIMEOUT = 408,

	/**
	 * The 409 (Conflict) status code indicates that the request could not be
	 * completed due to a conflict with the current state of the resource.
	 */
	CONFLICT = 409,

	/**
	 * The 410 (Gone) status code indicates that access to the target resource is
	 * no longer available at the origin server.
	 */
	GONE = 410,

	/**
	 * The 411 (Length Required) status code indicates that the server refuses to
	 * accept the request without a defined Content-Length.
	 */
	LENGTH_REQUIRED = 411,

	/**
	 * The 412 (Precondition Failed) status code indicates that one or more
	 * conditions given in the request header fields evaluated to false.
	 */
	PRECONDITION_FAILED = 412,

	/**
	 * The 413 (Content Too Large) status code indicates that the request content
	 * is larger than the server is willing or able to process.
	 */
	CONTENT_TOO_LARGE = 413,

	/**
	 * The 414 (URI Too Long) status code indicates that the request-target is
	 * longer than the server is willing to interpret.
	 */
	URI_TOO_LONG = 414,

	/**
	 * The 415 (Unsupported Media Type) status code indicates that the request
	 * payload format is not supported by the target resource.
	 */
	UNSUPPORTED_MEDIA_TYPE = 415,

	/**
	 * The 416 (Range Not Satisfiable) status code indicates that none of the
	 * requested ranges overlap the current extent of the resource.
	 */
	RANGE_NOT_SATISFIABLE = 416,

	/**
	 * The 417 (Expectation Failed) status code indicates that the expectation
	 * given in the request's Expect header field could not be met.
	 */
	EXPECTATION_FAILED = 417,

	/**
	 * The 421 (Misdirected Request) status code indicates that the request was
	 * directed at a server that is not able to produce a response.
	 */
	MISDIRECTED_REQUEST = 421,

	/**
	 * The 422 (Unprocessable Content) status code indicates that the server
	 * understands the content type and syntax but was unable to process it.
	 */
	UNPROCESSABLE_CONTENT = 422,

	/**
	 * The 426 (Upgrade Required) status code indicates that the server refuses to perform the
	 * request using the current protocol but might be willing to do so after the client upgrades
	 * to a different protocol.
	 */
	UPGRADE_REQUIRED = 426,

	/**
	 * The 428 (Precondition Required) status code indicates that the origin server
	 * requires the request to be conditional.
	 */
	PRECONDITION_REQUIRED = 428,

	/**
	 * The 429 (Too Many Requests) status code indicates that the user has sent too
	 * many requests in a given amount of time.
	 */
	TOO_MANY_REQUESTS = 429,

	/**
	 * The 431 (Request Header Fields Too Large) status code indicates that the
	 * server is unwilling to process the request because its header fields are
	 * too large.
	 */
	REQUEST_HEADER_FIELDS_TOO_LARGE = 431,

	/* =========================
	 * 5xx — Server Error
	 * ========================= */

	/**
	 * The 500 (Internal Server Error) status code indicates that the server
	 * encountered an unexpected condition that prevented it from fulfilling
	 * the request.
	 */
	INTERNAL_SERVER_ERROR = 500,

	/**
	 * The 501 (Not Implemented) status code indicates that the server does not
	 * support the functionality required to fulfill the request.
	 */
	NOT_IMPLEMENTED = 501,

	/**
	 * The 502 (Bad Gateway) status code indicates that the server received an
	 * invalid response from an inbound server.
	 */
	BAD_GATEWAY = 502,

	/**
	 * The 503 (Service Unavailable) status code indicates that the server is
	 * currently unable to handle the request due to temporary overload or
	 * scheduled maintenance.
	 */
	SERVICE_UNAVAILABLE = 503,

	/**
	 * The 504 (Gateway Timeout) status code indicates that the server did not
	 * receive a timely response from an upstream server.
	 */
	GATEWAY_TIMEOUT = 504,

	/**
	 * The 505 (HTTP Version Not Supported) status code indicates that the server
	 * does not support the HTTP protocol version used in the request.
	 */
	HTTP_VERSION_NOT_SUPPORTED = 505,
}

export type HttpStatusName = keyof typeof HttpStatus
