import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class UnavailableForLegalReasonsException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsWithSomeDefaults) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.UNAVAILABLE_FOR_LEGAL_REASONS,
			detail:
				detail ??
				'The server is denying access to the resource as a consequence of a legal demand.',
			status: HttpStatus.UNAVAILABLE_FOR_LEGAL_REASONS,
			instance,
		})
	}
}
