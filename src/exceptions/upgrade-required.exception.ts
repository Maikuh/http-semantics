import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { HttpStatus } from '../enums/http-status.enum'
import type { UpgradeRequiredOptions } from '../types/http-exception-options.type'
import type { ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { HttpException } from './http.exception'
import { buildProblemDetails, joinHeaderValues, withHeaders } from './problem-details.builder'

/**
 * 426 Upgrade Required
 *
 * @see https://www.rfc-editor.org/rfc/rfc9110#section-15.5.22
 */
export class UpgradeRequiredException<
	TExtensions extends Record<string, unknown> = Record<string, unknown>,
> extends HttpException<TExtensions> {
	// Explicit so the name survives minifiers that rename classes.
	override name: string = 'UpgradeRequiredException'

	constructor(
		problemDetails: ProblemDetailsWithSomeDefaults<TExtensions>,
		{ upgrade, ...options }: UpgradeRequiredOptions = {},
	) {
		super(
			buildProblemDetails(
				problemDetails,
				HttpStatus.UPGRADE_REQUIRED,
				HttpStatusPhrase.UPGRADE_REQUIRED,
				'The server refuses to perform the request using the current protocol but might be willing to do so after upgrading to a different protocol.',
			),
			withHeaders(options, { Upgrade: joinHeaderValues(upgrade) }),
		)
	}
}
