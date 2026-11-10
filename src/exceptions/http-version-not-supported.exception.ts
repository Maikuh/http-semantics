import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type { HttpExceptionOptions } from '../types/http-exception-options.type'
import type { ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { HttpException } from './http.exception'
import { buildProblemDetails } from './problem-details.builder'

/**
 * 505 HTTP Version Not Supported
 *
 * @see https://www.rfc-editor.org/rfc/rfc9110#section-15.6.6
 */
export class HttpVersionNotSupportedException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends HttpException<TExtensions> {
	// Explicit so the name survives minifiers that rename classes.
	override name: string = 'HttpVersionNotSupportedException'

	constructor(
		problemDetails: ProblemDetailsWithSomeDefaults<TExtensions>,
		options?: HttpExceptionOptions,
	) {
		super(
			buildProblemDetails(
				problemDetails,
				HttpStatus.HTTP_VERSION_NOT_SUPPORTED,
				HttpStatusPhrase.HTTP_VERSION_NOT_SUPPORTED,
				'The HTTP version used in the request is not supported by the server.',
			),
			options,
		)
	}
}
