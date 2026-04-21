import { HttpException } from '../exceptions/http.exception'
import { PROBLEM_JSON_CONTENT_TYPE } from '../types/problem-json.constant'

// ─── Express ────────────────────────────────────────────────────────────────

type ExpressNextFn = (err?: unknown) => void
type ExpressRequest = { method: string; url: string }
type ExpressResponse = {
	status: (code: number) => ExpressResponse
	setHeader: (name: string, value: string) => ExpressResponse
	json: (body: unknown) => void
}

/**
 * Returns a ready-to-use Express error handler that responds with RFC 9457
 * Problem Details JSON for any `HttpException`, and delegates everything else
 * to the next error handler.
 *
 * @example
 * ```ts
 * import { expressErrorHandler } from 'http-semantics'
 * app.use(expressErrorHandler())
 * ```
 */
export function expressErrorHandler() {
	return function httpErrorHandler(
		err: unknown,
		_req: ExpressRequest,
		res: ExpressResponse,
		next: ExpressNextFn,
	) {
		if (err instanceof HttpException) {
			res
				.status(err.problemDetails.status)
				.setHeader('Content-Type', PROBLEM_JSON_CONTENT_TYPE)
				.json(err.problemDetails)
			return
		}
		next(err)
	}
}

// ─── Fastify ─────────────────────────────────────────────────────────────────

type FastifyRequest = { log: { error: (err: unknown) => void } }
type FastifyReply = {
	code: (status: number) => FastifyReply
	header: (name: string, value: string) => FastifyReply
	send: (body: unknown) => void
}

/**
 * Returns a ready-to-use Fastify error handler that responds with RFC 9457
 * Problem Details JSON for any `HttpException`, and falls back to a 500 for
 * other errors.
 *
 * @example
 * ```ts
 * import { fastifyErrorHandler } from 'http-semantics'
 * fastify.setErrorHandler(fastifyErrorHandler())
 * ```
 */
export function fastifyErrorHandler(fallbackMessage = 'Internal Server Error') {
	return function httpErrorHandler(err: unknown, request: FastifyRequest, reply: FastifyReply) {
		request.log.error(err)

		if (err instanceof HttpException) {
			reply
				.code(err.problemDetails.status)
				.header('Content-Type', PROBLEM_JSON_CONTENT_TYPE)
				.send(err.problemDetails)
			return
		}

		reply.code(500).send({ message: fallbackMessage })
	}
}

// ─── Hono ────────────────────────────────────────────────────────────────────

type HonoContext = {
	json: (body: unknown, status: number) => Response
}

/**
 * Returns a ready-to-use Hono error handler that responds with RFC 9457
 * Problem Details JSON for any `HttpException`, and falls back to a 500 for
 * other errors.
 *
 * @example
 * ```ts
 * import { honoErrorHandler } from 'http-semantics'
 * app.onError(honoErrorHandler())
 * ```
 */
export function honoErrorHandler(fallbackMessage = 'Internal Server Error') {
	return function httpErrorHandler(err: unknown, c: HonoContext): Response {
		if (err instanceof HttpException) {
			return c.json(err.problemDetails, err.problemDetails.status)
		}
		return c.json({ message: fallbackMessage }, 500)
	}
}
