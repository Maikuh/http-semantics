import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsPartial } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class NotFoundException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsPartial) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.NOT_FOUND,
			detail: detail ?? 'The requested resource could not be found.',
			status: HttpStatus.NOT_FOUND,
			instance,
		})
		this.name = 'NotFoundException'
	}
}
