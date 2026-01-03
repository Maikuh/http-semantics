import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsPartial } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class NotImplementedException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsPartial) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.NOT_IMPLEMENTED,
			detail:
				detail ?? 'The server does not support the functionality required to fulfill the request.',
			status: HttpStatus.NOT_IMPLEMENTED,
			instance,
		})
		this.name = 'NotImplementedException'
	}
}
