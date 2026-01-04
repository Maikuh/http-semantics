import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class RequestTimeoutException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsWithSomeDefaults) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.REQUEST_TIMEOUT,
			detail:
				detail ??
				'The server did not receive a complete request message within the time that it was prepared to wait.',
			status: HttpStatus.REQUEST_TIMEOUT,
			instance,
		})
		this.name = 'RequestTimeoutException'
	}
}
