import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsPartial } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class PreconditionFailedException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsPartial) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.PRECONDITION_FAILED,
			detail: detail ?? 'One or more conditions in the request evaluated to false',
			status: HttpStatus.PRECONDITION_FAILED,
			instance,
		})
		this.name = 'PreconditionFailedException'
	}
}
