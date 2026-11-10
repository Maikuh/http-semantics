import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type { HttpExceptionOptions } from '../types/http-exception-options.type'
import type { ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { HttpException } from './http.exception'
import { buildProblemDetails } from './problem-details.builder'

/**
 * 414 URI Too Long
 *
 * @see https://www.rfc-editor.org/rfc/rfc9110#section-15.5.15
 */
export class UriTooLongException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends HttpException<TExtensions> {
	// Explicit so the name survives minifiers that rename classes.
	override name: string = 'UriTooLongException'

	constructor(
		problemDetails: ProblemDetailsWithSomeDefaults<TExtensions>,
		options?: HttpExceptionOptions,
	) {
		super(
			buildProblemDetails(
				problemDetails,
				HttpStatus.URI_TOO_LONG,
				HttpStatusPhrase.URI_TOO_LONG,
				'The target URI is longer than the server is willing to interpret.',
			),
			options,
		)
	}
}
