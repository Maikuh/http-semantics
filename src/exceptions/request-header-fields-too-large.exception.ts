import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type {
	HttpExceptionOptions,
	ProblemDetailsWithSomeDefaults,
} from '../types/problem-details.type'
import { HttpException } from './http.exception'
import { buildProblemDetails } from './problem-details.builder'

/**
 * 431 Request Header Fields Too Large
 *
 * @see https://www.rfc-editor.org/rfc/rfc6585#section-5
 */
export class RequestHeaderFieldsTooLargeException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends HttpException<TExtensions> {
	// Explicit so the name survives minifiers that rename classes.
	override name: string = 'RequestHeaderFieldsTooLargeException'

	constructor(
		problemDetails: ProblemDetailsWithSomeDefaults<TExtensions>,
		options?: HttpExceptionOptions,
	) {
		super(
			buildProblemDetails(
				problemDetails,
				HttpStatus.REQUEST_HEADER_FIELDS_TOO_LARGE,
				HttpStatusPhrase.REQUEST_HEADER_FIELDS_TOO_LARGE,
				'The server is unwilling to process the request because its header fields are too large.',
			),
			options,
		)
	}
}
