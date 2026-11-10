import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import { HttpException } from '../exceptions/http.exception'
import type { HttpStatusCode } from '../types/http-status-code.type'
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

/**
 * Returns the RFC 9110 reason phrase for a status code, or `undefined` if the code is unknown.
 *
 * @example
 * ```ts
 * getStatusPhrase(404) // 'Not Found'
 * getStatusPhrase(999) // undefined
 * ```
 */
export function getStatusPhrase(status: number): HttpStatusPhrase | undefined {
	if (!isHttpStatusCode(status)) return undefined
	return HttpStatusPhrase[HttpStatus[status] as keyof typeof HttpStatusPhrase]
}

/**
 * Type guard — narrows a value to one of the status codes known by this library
 * (see `HttpStatus`).
 *
 * @example
 * ```ts
 * isHttpStatusCode(404) // true
 * isHttpStatusCode(499) // false
 * ```
 */
export function isHttpStatusCode(value: unknown): value is HttpStatusCode {
	return typeof value === 'number' && typeof HttpStatus[value] === 'string'
}
