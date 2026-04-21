/**
 * The media type for RFC 9457 Problem Details responses.
 * Servers should use this as the `Content-Type` header value when returning problem details.
 *
 * @see https://www.rfc-editor.org/rfc/rfc9457#section-8.1
 *
 * @example
 * ```ts
 * res.setHeader('Content-Type', PROBLEM_JSON_CONTENT_TYPE)
 * res.json(err.problemDetails)
 * ```
 */
export const PROBLEM_JSON_CONTENT_TYPE = 'application/problem+json' as const
