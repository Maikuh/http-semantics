import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type { HttpStatusCode } from '../types/http-status-code.type'

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
