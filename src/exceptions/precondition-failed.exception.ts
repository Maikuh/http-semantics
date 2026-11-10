import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type {
	HttpExceptionOptions,
	ProblemDetailsWithSomeDefaults,
} from '../types/problem-details.type'
import { HttpException } from './http.exception'
import { buildProblemDetails } from './problem-details.builder'

/**
 * 412 Precondition Failed
 *
 * @see https://www.rfc-editor.org/rfc/rfc9110#section-15.5.13
 */
export class PreconditionFailedException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends HttpException<TExtensions> {
	// Explicit so the name survives minifiers that rename classes.
	override name: string = 'PreconditionFailedException'

	constructor(
		problemDetails: ProblemDetailsWithSomeDefaults<TExtensions>,
		options?: HttpExceptionOptions,
	) {
		super(
			buildProblemDetails(
				problemDetails,
				HttpStatus.PRECONDITION_FAILED,
				HttpStatusPhrase.PRECONDITION_FAILED,
				'One or more conditions given in the request header fields evaluated to false.',
			),
			options,
		)
	}
}
