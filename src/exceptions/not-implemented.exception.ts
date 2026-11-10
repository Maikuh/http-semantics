import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type { HttpExceptionOptions } from '../types/http-exception-options.type'
import type { ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { HttpException } from './http.exception'
import { buildProblemDetails } from './problem-details.builder'

/**
 * 501 Not Implemented
 *
 * @see https://www.rfc-editor.org/rfc/rfc9110#section-15.6.2
 */
export class NotImplementedException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends HttpException<TExtensions> {
	// Explicit so the name survives minifiers that rename classes.
	override name: string = 'NotImplementedException'

	constructor(
		problemDetails: ProblemDetailsWithSomeDefaults<TExtensions>,
		options?: HttpExceptionOptions,
	) {
		super(
			buildProblemDetails(
				problemDetails,
				HttpStatus.NOT_IMPLEMENTED,
				HttpStatusPhrase.NOT_IMPLEMENTED,
				'The server does not support the functionality required to fulfill the request.',
			),
			options,
		)
	}
}
