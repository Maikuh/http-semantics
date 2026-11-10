import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type {
	HttpExceptionOptions,
	ProblemDetailsWithSomeDefaults,
} from '../types/problem-details.type'
import { HttpException } from './http.exception'
import { buildProblemDetails } from './problem-details.builder'

/**
 * 503 Service Unavailable
 *
 * @see https://www.rfc-editor.org/rfc/rfc9110#section-15.6.4
 */
export class ServiceUnavailableException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends HttpException<TExtensions> {
	// Explicit so the name survives minifiers that rename classes.
	override name: string = 'ServiceUnavailableException'

	constructor(
		problemDetails: ProblemDetailsWithSomeDefaults<TExtensions>,
		options?: HttpExceptionOptions,
	) {
		super(
			buildProblemDetails(
				problemDetails,
				HttpStatus.SERVICE_UNAVAILABLE,
				HttpStatusPhrase.SERVICE_UNAVAILABLE,
				'The server is currently unable to handle the request due to a temporary overload or scheduled maintenance.',
			),
			options,
		)
	}
}
