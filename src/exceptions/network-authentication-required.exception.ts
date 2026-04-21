import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class NetworkAuthenticationRequiredException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsWithSomeDefaults) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.NETWORK_AUTHENTICATION_REQUIRED,
			detail: detail ?? 'The client needs to authenticate to gain network access.',
			status: HttpStatus.NETWORK_AUTHENTICATION_REQUIRED,
			instance,
		})
	}
}
