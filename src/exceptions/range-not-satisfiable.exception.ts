import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsPartial } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class RangeNotSatisfiableException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsPartial) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.RANGE_NOT_SATISFIABLE,
			detail: detail ?? 'The requested range cannot be satisfied.',
			status: HttpStatus.RANGE_NOT_SATISFIABLE,
			instance,
		})
		this.name = 'RangeNotSatisfiableException'
	}
}
