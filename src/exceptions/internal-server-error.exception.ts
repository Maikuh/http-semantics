import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type { HttpExceptionOptions } from '../types/http-exception-options.type'
import type { ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { HttpException } from './http.exception'
import { buildProblemDetails } from './problem-details.builder'

/**
 * 500 Internal Server Error
 *
 * @see https://www.rfc-editor.org/rfc/rfc9110#section-15.6.1
 */
export class InternalServerErrorException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends HttpException<TExtensions> {
	// Explicit so the name survives minifiers that rename classes.
	override name: string = 'InternalServerErrorException'

	constructor(
		problemDetails: ProblemDetailsWithSomeDefaults<TExtensions>,
		options?: HttpExceptionOptions,
	) {
		super(
			buildProblemDetails(
				problemDetails,
				HttpStatus.INTERNAL_SERVER_ERROR,
				HttpStatusPhrase.INTERNAL_SERVER_ERROR,
				'The server encountered an unexpected condition that prevented it from fulfilling the request.',
			),
			options,
		)
	}
}
