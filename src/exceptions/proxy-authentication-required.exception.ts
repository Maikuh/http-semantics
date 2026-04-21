import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class ProxyAuthenticationRequiredException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsWithSomeDefaults) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.PROXY_AUTHENTICATION_REQUIRED,
			detail:
				detail ??
				'The client needs to authenticate itself in order to use a proxy for this request.',
			status: HttpStatus.PROXY_AUTHENTICATION_REQUIRED,
			instance,
		})
	}
}
