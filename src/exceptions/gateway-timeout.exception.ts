import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type { HttpExceptionOptions } from '../types/http-exception-options.type'
import type { ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { HttpException } from './http.exception'
import { buildProblemDetails } from './problem-details.builder'

/**
 * 504 Gateway Timeout
 *
 * @see https://www.rfc-editor.org/rfc/rfc9110#section-15.6.5
 */
export class GatewayTimeoutException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends HttpException<TExtensions> {
	// Explicit so the name survives minifiers that rename classes.
	override name: string = 'GatewayTimeoutException'

	constructor(
		problemDetails: ProblemDetailsWithSomeDefaults<TExtensions>,
		options?: HttpExceptionOptions,
	) {
		super(
			buildProblemDetails(
				problemDetails,
				HttpStatus.GATEWAY_TIMEOUT,
				HttpStatusPhrase.GATEWAY_TIMEOUT,
				'The server did not receive a timely response from an upstream server while acting as a gateway or proxy.',
			),
			options,
		)
	}
}
