import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsPartial } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class ForbiddenException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsPartial) {
		super({
			...rest,
			type: type,
			title: title || HttpStatusPhrase.FORBIDDEN,
			detail: detail ?? 'You do not have permission to access this resource.',
			status: HttpStatus.FORBIDDEN,
			instance,
		})
		this.name = 'ForbiddenException'
	}
}
