import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class GatewayTimeoutException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsWithSomeDefaults) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.GATEWAY_TIMEOUT,
			detail:
				detail ??
				'The server did not receive a timely response from an upstream server while acting as a gateway or proxy.',
			status: HttpStatus.GATEWAY_TIMEOUT,
			instance,
		})
		this.name = 'GatewayTimeoutException'
	}
}
