import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type {
	HttpExceptionOptions,
	ProblemDetailsWithSomeDefaults,
} from '../types/problem-details.type'
import { HttpException } from './http.exception'
import { buildProblemDetails } from './problem-details.builder'

/**
 * 413 Content Too Large
 *
 * @see https://www.rfc-editor.org/rfc/rfc9110#section-15.5.14
 */
export class ContentTooLargeException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends HttpException<TExtensions> {
	// Explicit so the name survives minifiers that rename classes.
	override name: string = 'ContentTooLargeException'

	constructor(
		problemDetails: ProblemDetailsWithSomeDefaults<TExtensions>,
		options?: HttpExceptionOptions,
	) {
		super(
			buildProblemDetails(
				problemDetails,
				HttpStatus.CONTENT_TOO_LARGE,
				HttpStatusPhrase.CONTENT_TOO_LARGE,
				'The request content is larger than the server is willing or able to process.',
			),
			options,
		)
	}
}
