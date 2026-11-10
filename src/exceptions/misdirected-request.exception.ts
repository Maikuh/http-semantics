import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type { HttpExceptionOptions } from '../types/http-exception-options.type'
import type { ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { HttpException } from './http.exception'
import { buildProblemDetails } from './problem-details.builder'

/**
 * 421 Misdirected Request
 *
 * @see https://www.rfc-editor.org/rfc/rfc9110#section-15.5.20
 */
export class MisdirectedRequestException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends HttpException<TExtensions> {
	// Explicit so the name survives minifiers that rename classes.
	override name: string = 'MisdirectedRequestException'

	constructor(
		problemDetails: ProblemDetailsWithSomeDefaults<TExtensions>,
		options?: HttpExceptionOptions,
	) {
		super(
			buildProblemDetails(
				problemDetails,
				HttpStatus.MISDIRECTED_REQUEST,
				HttpStatusPhrase.MISDIRECTED_REQUEST,
				'The request was directed at a server that is unable or unwilling to produce an authoritative response for the target URI.',
			),
			options,
		)
	}
}
