import type { ProblemDetails } from '../types/problem-details.type'

/**
 * Defines the base HTTP exception class to be used by named HTTP exceptions.
 */
export class HttpException extends Error {
	problemDetails: ProblemDetails = {
		type: 'about:blank',
		title: 'HTTP Exception',
		detail: 'An HTTP exception has occurred.',
		status: 500,
		instance: '',
	}

	constructor(problemDetails: ProblemDetails, options?: { cause?: unknown }) {
		super(`${problemDetails.title} - ${problemDetails.detail}`, options)

		// Fixes subclass `instanceof` checks when transpiled to pre-ES2015 environments.
		Object.setPrototypeOf(this, new.target.prototype)

		Object.assign(this.problemDetails, problemDetails)

		// Automatically use the subclass constructor name (e.g. 'NotFoundException')
		// so every subclass no longer needs to manually set `this.name`.
		this.name = new.target.name
	}

	/**
	 * Returns an RFC 9457-compliant plain object suitable for JSON serialization.
	 * Allows `JSON.stringify(exception)` to produce the correct problem details body.
	 */
	toJSON(): ProblemDetails {
		return { ...this.problemDetails }
	}
}
