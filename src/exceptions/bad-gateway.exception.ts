import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class BadGatewayException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsWithSomeDefaults) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.BAD_GATEWAY,
			detail:
				detail ??
				'The server received an invalid response from the upstream server while acting as a gateway or proxy.',
			status: HttpStatus.BAD_GATEWAY,
			instance,
		})
		this.name = 'BadGatewayException'
	}
}
