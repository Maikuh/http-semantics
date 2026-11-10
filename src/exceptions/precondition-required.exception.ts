import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type {
	HttpExceptionOptions,
	ProblemDetailsWithSomeDefaults,
} from '../types/problem-details.type'
import { HttpException } from './http.exception'
import { buildProblemDetails } from './problem-details.builder'

/**
 * 428 Precondition Required
 *
 * @see https://www.rfc-editor.org/rfc/rfc6585#section-3
 */
export class PreconditionRequiredException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends HttpException<TExtensions> {
	// Explicit so the name survives minifiers that rename classes.
	override name: string = 'PreconditionRequiredException'

	constructor(
		problemDetails: ProblemDetailsWithSomeDefaults<TExtensions>,
		options?: HttpExceptionOptions,
	) {
		super(
			buildProblemDetails(
				problemDetails,
				HttpStatus.PRECONDITION_REQUIRED,
				HttpStatusPhrase.PRECONDITION_REQUIRED,
				'The server requires the request to be conditional.',
			),
			options,
		)
	}
}
