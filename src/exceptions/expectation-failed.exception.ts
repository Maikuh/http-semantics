import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsPartial } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class ExpectationFailedException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsPartial) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.EXPECTATION_FAILED,
			detail:
				detail ?? 'The server could not meet the requirements of the Expect request-header field.',
			status: HttpStatus.EXPECTATION_FAILED,
			instance,
		})
		this.name = 'ExpectationFailedException'
	}
}
