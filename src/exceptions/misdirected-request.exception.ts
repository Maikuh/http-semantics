import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsPartial } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class MisdirectedRequestException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsPartial) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.MISDIRECTED_REQUEST,
			detail:
				detail ??
				'The server that is unable or unwilling to produce an authoritative response for the target resource',
			status: HttpStatus.MISDIRECTED_REQUEST,
			instance,
		})
		this.name = 'MisdirectedRequestException'
	}
}
