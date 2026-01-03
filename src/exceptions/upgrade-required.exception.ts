import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsPartial } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class UpgradeRequiredException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsPartial) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.UPGRADE_REQUIRED,
			detail:
				detail ??
				'The server refuses to perform the request using the current protocol but might be willing to do so after upgrading to a different protocol.',
			status: HttpStatus.UPGRADE_REQUIRED,
			instance,
		})
		this.name = 'UpgradeRequiredException'
	}
}
