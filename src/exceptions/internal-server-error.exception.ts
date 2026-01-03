import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsPartial } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class InternalServerErrorException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsPartial) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.INTERNAL_SERVER_ERROR,
			detail:
				detail ??
				'The server encountered an unexpected condition that prevented it from fulfilling the request.',
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			instance,
		})
		this.name = 'InternalServerErrorException'
	}
}
