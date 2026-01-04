import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class RequestHeaderFieldsTooLargeException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsWithSomeDefaults) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.REQUEST_HEADER_FIELDS_TOO_LARGE,
			detail: detail ?? 'Unwilling to process request due to the header fields being too large',
			status: HttpStatus.REQUEST_HEADER_FIELDS_TOO_LARGE,
			instance,
		})
		this.name = 'RequestHeaderFieldsTooLargeException'
	}
}
