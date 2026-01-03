import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsPartial } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class LengthRequiredException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsPartial) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.LENGTH_REQUIRED,
			detail:
				detail ??
				'The request did not specify the length of its content, which is required by the resource.',
			status: HttpStatus.LENGTH_REQUIRED,
			instance,
		})
		this.name = 'LengthRequiredException'
	}
}
