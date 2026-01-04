import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class NotAcceptableException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsWithSomeDefaults) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.NOT_ACCEPTABLE,
			detail:
				detail ??
				'The resource identified by the request does not have a current representation that would be acceptable',
			status: HttpStatus.NOT_ACCEPTABLE,
			instance,
		})
		this.name = 'NotAcceptableException'
	}
}
