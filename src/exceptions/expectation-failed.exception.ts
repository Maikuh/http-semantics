import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type {
	HttpExceptionOptions,
	ProblemDetailsWithSomeDefaults,
} from '../types/problem-details.type'
import { HttpException } from './http.exception'
import { buildProblemDetails } from './problem-details.builder'

/**
 * 417 Expectation Failed
 *
 * @see https://www.rfc-editor.org/rfc/rfc9110#section-15.5.18
 */
export class ExpectationFailedException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends HttpException<TExtensions> {
	// Explicit so the name survives minifiers that rename classes.
	override name: string = 'ExpectationFailedException'

	constructor(
		problemDetails: ProblemDetailsWithSomeDefaults<TExtensions>,
		options?: HttpExceptionOptions,
	) {
		super(
			buildProblemDetails(
				problemDetails,
				HttpStatus.EXPECTATION_FAILED,
				HttpStatusPhrase.EXPECTATION_FAILED,
				"The expectation given in the request's Expect header field could not be met.",
			),
			options,
		)
	}
}
