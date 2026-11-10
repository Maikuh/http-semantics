import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type {
	HttpExceptionOptions,
	ProblemDetailsWithSomeDefaults,
} from '../types/problem-details.type'
import { HttpException } from './http.exception'
import { buildProblemDetails } from './problem-details.builder'

/**
 * 409 Conflict
 *
 * @see https://www.rfc-editor.org/rfc/rfc9110#section-15.5.10
 */
export class ConflictException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends HttpException<TExtensions> {
	// Explicit so the name survives minifiers that rename classes.
	override name: string = 'ConflictException'

	constructor(
		problemDetails: ProblemDetailsWithSomeDefaults<TExtensions>,
		options?: HttpExceptionOptions,
	) {
		super(
			buildProblemDetails(
				problemDetails,
				HttpStatus.CONFLICT,
				HttpStatusPhrase.CONFLICT,
				'The request could not be completed due to a conflict with the current state of the resource.',
			),
			options,
		)
	}
}
