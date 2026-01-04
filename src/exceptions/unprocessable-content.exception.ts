import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class UnprocessableContentException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsWithSomeDefaults) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.UNPROCESSABLE_CONTENT,
			detail:
				detail ??
				'The content type and syntax of the request are correct, but the server is unable to process the contained instructions.',
			status: HttpStatus.UNPROCESSABLE_CONTENT,
			instance,
		})
		this.name = 'UnprocessableContentException'
	}
}
