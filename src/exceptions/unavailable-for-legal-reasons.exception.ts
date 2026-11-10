import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type {
	HttpExceptionOptions,
	ProblemDetailsWithSomeDefaults,
} from '../types/problem-details.type'
import { HttpException } from './http.exception'
import { buildProblemDetails } from './problem-details.builder'

/**
 * 451 Unavailable For Legal Reasons
 *
 * @see https://www.rfc-editor.org/rfc/rfc7725#section-3
 */
export class UnavailableForLegalReasonsException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends HttpException<TExtensions> {
	// Explicit so the name survives minifiers that rename classes.
	override name: string = 'UnavailableForLegalReasonsException'

	constructor(
		problemDetails: ProblemDetailsWithSomeDefaults<TExtensions>,
		options?: HttpExceptionOptions,
	) {
		super(
			buildProblemDetails(
				problemDetails,
				HttpStatus.UNAVAILABLE_FOR_LEGAL_REASONS,
				HttpStatusPhrase.UNAVAILABLE_FOR_LEGAL_REASONS,
				'The server is denying access to the resource as a consequence of a legal demand.',
			),
			options,
		)
	}
}
