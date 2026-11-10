import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type {
	HttpExceptionOptions,
	ProblemDetailsWithSomeDefaults,
} from '../types/problem-details.type'
import { HttpException } from './http.exception'
import { buildProblemDetails } from './problem-details.builder'

/**
 * 511 Network Authentication Required
 *
 * @see https://www.rfc-editor.org/rfc/rfc6585#section-6
 */
export class NetworkAuthenticationRequiredException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends HttpException<TExtensions> {
	// Explicit so the name survives minifiers that rename classes.
	override name: string = 'NetworkAuthenticationRequiredException'

	constructor(
		problemDetails: ProblemDetailsWithSomeDefaults<TExtensions>,
		options?: HttpExceptionOptions,
	) {
		super(
			buildProblemDetails(
				problemDetails,
				HttpStatus.NETWORK_AUTHENTICATION_REQUIRED,
				HttpStatusPhrase.NETWORK_AUTHENTICATION_REQUIRED,
				'The client needs to authenticate to gain network access.',
			),
			options,
		)
	}
}
