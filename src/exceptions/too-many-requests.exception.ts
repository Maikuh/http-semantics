import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type {
	HttpExceptionOptions,
	ProblemDetailsWithSomeDefaults,
} from '../types/problem-details.type'
import { HttpException } from './http.exception'
import { buildProblemDetails } from './problem-details.builder'

/**
 * 429 Too Many Requests
 *
 * @see https://www.rfc-editor.org/rfc/rfc6585#section-4
 */
export class TooManyRequestsException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends HttpException<TExtensions> {
	// Explicit so the name survives minifiers that rename classes.
	override name: string = 'TooManyRequestsException'

	constructor(
		problemDetails: ProblemDetailsWithSomeDefaults<TExtensions>,
		options?: HttpExceptionOptions,
	) {
		super(
			buildProblemDetails(
				problemDetails,
				HttpStatus.TOO_MANY_REQUESTS,
				HttpStatusPhrase.TOO_MANY_REQUESTS,
				'The user has sent too many requests in a given amount of time.',
			),
			options,
		)
	}
}
