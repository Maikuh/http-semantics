import type { ProblemDetails } from '../types/problem-details.type'

/**
 * Defines the base HTTP exception class to be used by named HTTP exceptions.
 */
export class HttpException extends Error {
	problemDetails: Partial<ProblemDetails> = {
		type: 'about:blank',
		title: 'HTTP Exception',
		detail: 'An HTTP exception has occurred.',
		status: 500,
	}

	constructor(problemDetails: ProblemDetails) {
		super(`${problemDetails.title} - ${problemDetails.detail}`)

		Object.assign(this.problemDetails, problemDetails)

		this.name = 'HttpException'
	}
}
