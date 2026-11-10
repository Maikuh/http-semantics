import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type { HttpExceptionOptions } from '../types/http-exception-options.type'
import type { ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { HttpException } from './http.exception'
import { buildProblemDetails } from './problem-details.builder'

/**
 * 422 Unprocessable Content
 *
 * @see https://www.rfc-editor.org/rfc/rfc9110#section-15.5.21
 */
export class UnprocessableContentException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends HttpException<TExtensions> {
	// Explicit so the name survives minifiers that rename classes.
	override name: string = 'UnprocessableContentException'

	constructor(
		problemDetails: ProblemDetailsWithSomeDefaults<TExtensions>,
		options?: HttpExceptionOptions,
	) {
		super(
			buildProblemDetails(
				problemDetails,
				HttpStatus.UNPROCESSABLE_CONTENT,
				HttpStatusPhrase.UNPROCESSABLE_CONTENT,
				'The content type and syntax of the request are correct, but the server is unable to process the contained instructions.',
			),
			options,
		)
	}
}
