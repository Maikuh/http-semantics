import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsPartial } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class ServiceUnavailableException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsPartial) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.SERVICE_UNAVAILABLE,
			detail:
				detail ??
				'The server is currently unable to handle the request due to a temporary overload or scheduled maintenance.',
			status: HttpStatus.SERVICE_UNAVAILABLE,
			instance,
		})
		this.name = 'ServiceUnavailableException'
	}
}
