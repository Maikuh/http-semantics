import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsPartial } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class TooManyRequestsException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsPartial) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.TOO_MANY_REQUESTS,
			detail: detail ?? 'Received too many requests',
			status: HttpStatus.TOO_MANY_REQUESTS,
			instance,
		})
		this.name = 'TooManyRequestsException'
	}
}
