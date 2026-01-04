import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class BadRequestException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsWithSomeDefaults) {
		super({
			...rest,
			type: type,
			title: title || HttpStatusPhrase.BAD_REQUEST,
			detail:
				detail ?? 'The request could not be understood by the server due to malformed syntax.',
			status: HttpStatus.BAD_REQUEST,
			instance,
		})
		this.name = 'BadRequestException'
	}
}
