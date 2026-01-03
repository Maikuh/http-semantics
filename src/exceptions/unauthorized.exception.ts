import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsPartial } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class UnauthorizedException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsPartial) {
		super({
			...rest,
			type: type,
			title: title || HttpStatusPhrase.UNAUTHORIZED,
			detail: detail ?? 'You are not authorized to access this resource.',
			status: HttpStatus.UNAUTHORIZED,
			instance,
		})
		this.name = 'UnauthorizedException'
	}
}
