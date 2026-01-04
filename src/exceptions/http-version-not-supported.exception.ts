import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class HttpVersionNotSupportedException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsWithSomeDefaults) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.HTTP_VERSION_NOT_SUPPORTED,
			detail: detail ?? 'The HTTP version used in the request is not supported by the server.',
			status: HttpStatus.HTTP_VERSION_NOT_SUPPORTED,
			instance,
		})
		this.name = 'HttpVersionNotSupportedException'
	}
}
