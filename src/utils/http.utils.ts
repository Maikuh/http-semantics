import { HttpException } from '../exceptions/http.exception'
import type { ProblemDetails } from '../types/problem-details.type'

/**
 * Type guard — narrows `unknown` to `HttpException`.
 *
 * @example
 * ```ts
 * try { ... } catch (err) {
 *   if (isHttpException(err)) {
 *     console.log(err.problemDetails.status)
 *   }
 * }
 * ```
 */
export function isHttpException(error: unknown): error is HttpException {
	return error instanceof HttpException
}

/**
 * Type guard — narrows to a 4xx `HttpException` (client error).
 */
export function isClientError(error: unknown): error is HttpException {
	return (
		isHttpException(error) &&
		error.problemDetails.status >= 400 &&
		error.problemDetails.status < 500
	)
}

/**
 * Type guard — narrows to a 5xx `HttpException` (server error).
 */
export function isServerError(error: unknown): error is HttpException {
	return (
		isHttpException(error) &&
		error.problemDetails.status >= 500 &&
		error.problemDetails.status < 600
	)
}

/**
 * Returns `true` for 1xx status codes.
 */
export function isInformational(status: number): boolean {
	return status >= 100 && status < 200
}

/**
 * Returns `true` for 2xx status codes.
 */
export function isSuccess(status: number): boolean {
	return status >= 200 && status < 300
}

/**
 * Returns `true` for 3xx status codes.
 */
export function isRedirect(status: number): boolean {
	return status >= 300 && status < 400
}

/**
 * Extracts the RFC 9457 problem details from any value.
 * Returns `undefined` if the value is not an `HttpException`.
 */
export function getProblemDetails(error: unknown): ProblemDetails | undefined {
	return isHttpException(error) ? error.problemDetails : undefined
}
