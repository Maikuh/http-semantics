import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsPartial } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class MethodNotAllowedException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsPartial) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.METHOD_NOT_ALLOWED,
			detail: detail ?? 'The method specified in the request is not supported for the resource.',
			status: HttpStatus.METHOD_NOT_ALLOWED,
			instance,
		})
		this.name = 'MethodNotAllowedException'
	}
}
