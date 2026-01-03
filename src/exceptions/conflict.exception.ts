import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsPartial } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class ConflictException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsPartial) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.CONFLICT,
			detail:
				detail ??
				'The request could not be completed due to a conflict with the current state of the resource.',
			status: HttpStatus.CONFLICT,
			instance,
		})
		this.name = 'ConflictException'
	}
}
