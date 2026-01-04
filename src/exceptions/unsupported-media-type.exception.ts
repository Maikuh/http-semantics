import { HttpStatus } from '../enums/http-status.enum'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import type { ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { HttpException } from './http.exception'

export class UnsupportedMediaTypeException extends HttpException {
	constructor({ type, title, detail, instance, ...rest }: ProblemDetailsWithSomeDefaults) {
		super({
			...rest,
			type,
			title: title || HttpStatusPhrase.UNSUPPORTED_MEDIA_TYPE,
			detail:
				detail ?? 'The request media type is not supported by the used method on this resource.',
			status: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
			instance,
		})
		this.name = 'UnsupportedMediaTypeException'
	}
}
