import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type { HttpExceptionOptions } from '../types/http-exception-options.type'
import type { ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { HttpException } from './http.exception'
import { buildProblemDetails } from './problem-details.builder'

/**
 * 403 Forbidden
 *
 * @see https://www.rfc-editor.org/rfc/rfc9110#section-15.5.4
 */
export class ForbiddenException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends HttpException<TExtensions> {
	// Explicit so the name survives minifiers that rename classes.
	override name: string = 'ForbiddenException'

	constructor(
		problemDetails: ProblemDetailsWithSomeDefaults<TExtensions>,
		options?: HttpExceptionOptions,
	) {
		super(
			buildProblemDetails(
				problemDetails,
				HttpStatus.FORBIDDEN,
				HttpStatusPhrase.FORBIDDEN,
				'You do not have permission to access this resource.',
			),
			options,
		)
	}
}
