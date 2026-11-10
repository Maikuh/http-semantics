import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type { HttpExceptionOptions } from '../types/http-exception-options.type'
import type { ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { HttpException } from './http.exception'
import { buildProblemDetails } from './problem-details.builder'

/**
 * 408 Request Timeout
 *
 * @see https://www.rfc-editor.org/rfc/rfc9110#section-15.5.9
 */
export class RequestTimeoutException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends HttpException<TExtensions> {
	// Explicit so the name survives minifiers that rename classes.
	override name: string = 'RequestTimeoutException'

	constructor(
		problemDetails: ProblemDetailsWithSomeDefaults<TExtensions>,
		options?: HttpExceptionOptions,
	) {
		super(
			buildProblemDetails(
				problemDetails,
				HttpStatus.REQUEST_TIMEOUT,
				HttpStatusPhrase.REQUEST_TIMEOUT,
				'The server did not receive a complete request message within the time that it was prepared to wait.',
			),
			options,
		)
	}
}
