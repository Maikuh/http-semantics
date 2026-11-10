import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type { HttpExceptionOptions } from '../types/http-exception-options.type'
import type { ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { HttpException } from './http.exception'
import { buildProblemDetails } from './problem-details.builder'

/**
 * 416 Range Not Satisfiable
 *
 * @see https://www.rfc-editor.org/rfc/rfc9110#section-15.5.17
 */
export class RangeNotSatisfiableException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends HttpException<TExtensions> {
	// Explicit so the name survives minifiers that rename classes.
	override name: string = 'RangeNotSatisfiableException'

	constructor(
		problemDetails: ProblemDetailsWithSomeDefaults<TExtensions>,
		options?: HttpExceptionOptions,
	) {
		super(
			buildProblemDetails(
				problemDetails,
				HttpStatus.RANGE_NOT_SATISFIABLE,
				HttpStatusPhrase.RANGE_NOT_SATISFIABLE,
				'The requested range cannot be satisfied.',
			),
			options,
		)
	}
}
