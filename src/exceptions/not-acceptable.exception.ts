import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type {
	HttpExceptionOptions,
	ProblemDetailsWithSomeDefaults,
} from '../types/problem-details.type'
import { HttpException } from './http.exception'
import { buildProblemDetails } from './problem-details.builder'

/**
 * 406 Not Acceptable
 *
 * @see https://www.rfc-editor.org/rfc/rfc9110#section-15.5.7
 */
export class NotAcceptableException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends HttpException<TExtensions> {
	// Explicit so the name survives minifiers that rename classes.
	override name: string = 'NotAcceptableException'

	constructor(
		problemDetails: ProblemDetailsWithSomeDefaults<TExtensions>,
		options?: HttpExceptionOptions,
	) {
		super(
			buildProblemDetails(
				problemDetails,
				HttpStatus.NOT_ACCEPTABLE,
				HttpStatusPhrase.NOT_ACCEPTABLE,
				'The target resource does not have a current representation that would be acceptable to the user agent.',
			),
			options,
		)
	}
}
