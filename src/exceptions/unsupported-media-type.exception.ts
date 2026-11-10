import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type { HttpExceptionOptions } from '../types/http-exception-options.type'
import type { ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { HttpException } from './http.exception'
import { buildProblemDetails } from './problem-details.builder'

/**
 * 415 Unsupported Media Type
 *
 * @see https://www.rfc-editor.org/rfc/rfc9110#section-15.5.16
 */
export class UnsupportedMediaTypeException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends HttpException<TExtensions> {
	// Explicit so the name survives minifiers that rename classes.
	override name: string = 'UnsupportedMediaTypeException'

	constructor(
		problemDetails: ProblemDetailsWithSomeDefaults<TExtensions>,
		options?: HttpExceptionOptions,
	) {
		super(
			buildProblemDetails(
				problemDetails,
				HttpStatus.UNSUPPORTED_MEDIA_TYPE,
				HttpStatusPhrase.UNSUPPORTED_MEDIA_TYPE,
				'The content is in a format not supported by this method on the target resource.',
			),
			options,
		)
	}
}
