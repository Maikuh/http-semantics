import type { HttpExceptionOptions } from '../types/http-exception-options.type'
import type { HttpStatusCode } from '../types/http-status-code.type'
import type { ProblemDetails, ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'

/**
 * Builds a full problem details object for a named exception, applying its status and
 * default `title`/`detail`. Not part of the public API.
 *
 * @internal
 */
export function buildProblemDetails<TExtensions extends Record<string, unknown>>(
	input: ProblemDetailsWithSomeDefaults<TExtensions>,
	status: HttpStatusCode,
	defaultTitle: string,
	defaultDetail: string,
): ProblemDetails<TExtensions> {
	// `status` is owned by the exception class, so a caller-provided one is dropped.
	const { type, instance, title, detail, status: _status, ...extensions } = input
	return {
		type,
		status,
		title: title || defaultTitle,
		detail: detail ?? defaultDetail,
		...(instance === undefined ? {} : { instance }),
		...extensions,
	} as ProblemDetails<TExtensions>
}

/**
 * Merges header values derived from typed options (e.g. `retryAfter`) into
 * `options.headers`. Undefined values are skipped. Not part of the public API.
 *
 * @internal
 */
export function withHeaders(
	options: HttpExceptionOptions,
	headers: Record<string, string | undefined>,
): HttpExceptionOptions {
	const merged: Record<string, string> = { ...options.headers }
	for (const [name, value] of Object.entries(headers)) {
		if (value !== undefined) merged[name] = value
	}
	return { ...options, headers: merged }
}

/**
 * Formats a `Retry-After` value as delay-seconds or an HTTP-date.
 *
 * @internal
 */
export function formatRetryAfter(retryAfter: number | Date | undefined): string | undefined {
	if (retryAfter === undefined) return undefined
	if (retryAfter instanceof Date) return retryAfter.toUTCString()
	if (!Number.isFinite(retryAfter) || retryAfter < 0) {
		throw new RangeError(`retryAfter must be a non-negative number of seconds, got ${retryAfter}`)
	}
	return String(Math.ceil(retryAfter))
}

/**
 * Formats an unsatisfied-range `Content-Range` value: `bytes`, `*`, `/` and the length.
 *
 * @internal
 */
export function formatUnsatisfiedRange(completeLength: number | undefined): string | undefined {
	if (completeLength === undefined) return undefined
	if (!Number.isSafeInteger(completeLength) || completeLength < 0) {
		throw new RangeError(`completeLength must be a non-negative integer, got ${completeLength}`)
	}
	return `bytes */${completeLength}`
}

/**
 * Joins list-based header values (e.g. `Allow`, `WWW-Authenticate`).
 *
 * @internal
 */
export function joinHeaderValues(
	value: string | readonly string[] | undefined,
): string | undefined {
	if (value === undefined) return undefined
	return typeof value === 'string' ? value : value.join(', ')
}
