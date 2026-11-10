/**
 * Options accepted by every `HttpException` constructor.
 */
export type HttpExceptionOptions = {
	/** The underlying error that caused this exception, exposed as `error.cause`. */
	cause?: unknown
	/**
	 * Response header fields to send along with the problem details, exposed as
	 * `error.headers` and applied by the bundled framework error handlers.
	 */
	headers?: Record<string, string>
}

/**
 * Options for exceptions where the server can say when to retry (429, 503, 413).
 */
export type RetryAfterOptions = HttpExceptionOptions & {
	/**
	 * Sets the `Retry-After` header: a number of seconds to wait, or the date after which
	 * the request can be retried.
	 *
	 * @see https://www.rfc-editor.org/rfc/rfc9110#section-10.2.3
	 */
	retryAfter?: number | Date
}

/**
 * Options for 401 Unauthorized.
 */
export type UnauthorizedOptions = HttpExceptionOptions & {
	/**
	 * Sets the `WWW-Authenticate` header, which RFC 9110 requires on 401 responses
	 * (e.g. `'Bearer realm="api"'`). Several challenges are joined with `, `.
	 *
	 * @see https://www.rfc-editor.org/rfc/rfc9110#section-11.6.1
	 */
	wwwAuthenticate?: string | readonly string[]
}

/**
 * Options for 407 Proxy Authentication Required.
 */
export type ProxyAuthenticationRequiredOptions = HttpExceptionOptions & {
	/**
	 * Sets the `Proxy-Authenticate` header, which RFC 9110 requires on 407 responses.
	 * Several challenges are joined with `, `.
	 *
	 * @see https://www.rfc-editor.org/rfc/rfc9110#section-11.7.1
	 */
	proxyAuthenticate?: string | readonly string[]
}

/**
 * Options for 405 Method Not Allowed.
 */
export type MethodNotAllowedOptions = HttpExceptionOptions & {
	/**
	 * Sets the `Allow` header, which RFC 9110 requires on 405 responses
	 * (e.g. `['GET', 'HEAD']`).
	 *
	 * @see https://www.rfc-editor.org/rfc/rfc9110#section-10.2.1
	 */
	allow?: readonly string[]
}

/**
 * Options for 426 Upgrade Required.
 */
export type UpgradeRequiredOptions = HttpExceptionOptions & {
	/**
	 * Sets the `Upgrade` header, which RFC 9110 requires on 426 responses
	 * (e.g. `['HTTP/3.0']`).
	 *
	 * @see https://www.rfc-editor.org/rfc/rfc9110#section-7.8
	 */
	upgrade?: readonly string[]
}

/**
 * Options for 416 Range Not Satisfiable.
 */
export type RangeNotSatisfiableOptions = HttpExceptionOptions & {
	/**
	 * Current length of the selected representation in bytes. Sets an unsatisfied-range
	 * `Content-Range` header carrying this length (e.g. `bytes`, `*`, `/1024`), which RFC 9110
	 * recommends on 416 responses to byte-range requests.
	 *
	 * @see https://www.rfc-editor.org/rfc/rfc9110#section-15.5.17
	 */
	completeLength?: number
}
