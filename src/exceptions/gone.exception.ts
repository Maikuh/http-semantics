import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsPartial } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class GoneException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsPartial) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.GONE,
			detail:
				detail ??
				'The requested resource is no longer available and likely to not be available again.',
			status: HttpStatus.GONE,
			instance,
		})
		this.name = 'GoneException'
	}
}
