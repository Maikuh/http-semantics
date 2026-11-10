import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type { HttpExceptionOptions } from '../types/http-exception-options.type'
import type { ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { HttpException } from './http.exception'
import { buildProblemDetails } from './problem-details.builder'

/**
 * 502 Bad Gateway
 *
 * @see https://www.rfc-editor.org/rfc/rfc9110#section-15.6.3
 */
export class BadGatewayException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends HttpException<TExtensions> {
	// Explicit so the name survives minifiers that rename classes.
	override name: string = 'BadGatewayException'

	constructor(
		problemDetails: ProblemDetailsWithSomeDefaults<TExtensions>,
		options?: HttpExceptionOptions,
	) {
		super(
			buildProblemDetails(
				problemDetails,
				HttpStatus.BAD_GATEWAY,
				HttpStatusPhrase.BAD_GATEWAY,
				'The server received an invalid response from the upstream server while acting as a gateway or proxy.',
			),
			options,
		)
	}
}
