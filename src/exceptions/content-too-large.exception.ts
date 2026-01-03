import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsPartial } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class ContentTooLargeException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsPartial) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.CONTENT_TOO_LARGE,
			detail:
				detail ?? 'The request content is larger than the server is willing or able to process.',
			status: HttpStatus.CONTENT_TOO_LARGE,
			instance,
		})
		this.name = 'ContentTooLargeException'
	}
}
