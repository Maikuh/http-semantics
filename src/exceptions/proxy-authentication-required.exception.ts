import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type {
	HttpExceptionOptions,
	ProblemDetailsWithSomeDefaults,
} from '../types/problem-details.type'
import { HttpException } from './http.exception'
import { buildProblemDetails } from './problem-details.builder'

/**
 * 407 Proxy Authentication Required
 *
 * @see https://www.rfc-editor.org/rfc/rfc9110#section-15.5.8
 */
export class ProxyAuthenticationRequiredException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends HttpException<TExtensions> {
	// Explicit so the name survives minifiers that rename classes.
	override name: string = 'ProxyAuthenticationRequiredException'

	constructor(
		problemDetails: ProblemDetailsWithSomeDefaults<TExtensions>,
		options?: HttpExceptionOptions,
	) {
		super(
			buildProblemDetails(
				problemDetails,
				HttpStatus.PROXY_AUTHENTICATION_REQUIRED,
				HttpStatusPhrase.PROXY_AUTHENTICATION_REQUIRED,
				'The client needs to authenticate itself in order to use a proxy for this request.',
			),
			options,
		)
	}
}
