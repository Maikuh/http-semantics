import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type { HttpExceptionOptions } from '../types/http-exception-options.type'
import type { ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { HttpException } from './http.exception'
import { buildProblemDetails } from './problem-details.builder'

/**
 * 411 Length Required
 *
 * @see https://www.rfc-editor.org/rfc/rfc9110#section-15.5.12
 */
export class LengthRequiredException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends HttpException<TExtensions> {
	// Explicit so the name survives minifiers that rename classes.
	override name: string = 'LengthRequiredException'

	constructor(
		problemDetails: ProblemDetailsWithSomeDefaults<TExtensions>,
		options?: HttpExceptionOptions,
	) {
		super(
			buildProblemDetails(
				problemDetails,
				HttpStatus.LENGTH_REQUIRED,
				HttpStatusPhrase.LENGTH_REQUIRED,
				'The request did not specify the length of its content, which is required by the resource.',
			),
			options,
		)
	}
}
