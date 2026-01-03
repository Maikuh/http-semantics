import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsPartial } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class PreconditionRequiredException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsPartial) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.PRECONDITION_REQUIRED,
			detail: detail ?? 'The server requires the request to be conditional.',
			status: HttpStatus.PRECONDITION_REQUIRED,
			instance,
		})
		this.name = 'PreconditionRequiredException'
	}
}
