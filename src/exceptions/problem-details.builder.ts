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
		instance,
		...extensions,
	} as ProblemDetails<TExtensions>
}
