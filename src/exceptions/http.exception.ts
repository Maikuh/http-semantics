import type { HttpExceptionOptions, ProblemDetails } from '../types/problem-details.type'

/**
 * Base HTTP exception class, extended by every named HTTP exception.
 *
 * The generic parameter `TExtensions` types the RFC 9457 extension members carried in
 * `problemDetails`.
 *
 * @example
 * ```ts
 * throw new HttpException({
 *   type: 'https://example.com/problems/out-of-credit',
 *   instance: '/account/12345/msgs/abc',
 *   status: 403,
 *   title: 'You do not have enough credit.',
 *   detail: 'Your current balance is 30, but that costs 50.',
 *   balance: 30,
 * })
 * ```
 */
export class HttpException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends Error {
	problemDetails: ProblemDetails<TExtensions>

	constructor(problemDetails: ProblemDetails<TExtensions>, options?: HttpExceptionOptions) {
		super(`${problemDetails.title} - ${problemDetails.detail}`, options)

		// Fixes subclass `instanceof` checks when transpiled to pre-ES2015 environments.
		Object.setPrototypeOf(this, new.target.prototype)

		// Copy so later mutations of the caller's object don't leak into the exception.
		this.problemDetails = { ...problemDetails }

		// Use the subclass constructor name (e.g. 'NotFoundException').
		this.name = new.target.name
	}

	/**
	 * Returns an RFC 9457-compliant plain object suitable for JSON serialization.
	 * Allows `JSON.stringify(exception)` to produce the correct problem details body.
	 */
	toJSON(): ProblemDetails<TExtensions> {
		return { ...this.problemDetails }
	}
}
