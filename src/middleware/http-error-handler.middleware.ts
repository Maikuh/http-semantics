import { HttpStatus } from '../enums/http-status.enum'
import { HttpException } from '../exceptions/http.exception'
import type { HttpStatusCode } from '../types/http-status-code.type'
import type { ProblemDetails } from '../types/problem-details.type'
import { PROBLEM_JSON_CONTENT_TYPE } from '../types/problem-json.constant'
import { getStatusPhrase, isHttpStatusCode } from '../utils/http.utils'

// ─── Express ────────────────────────────────────────────────────────────────

type ExpressNextFn = (err?: unknown) => void
type ExpressRequest = { method: string; url: string }
// Method syntax keeps parameters bivariant so the real framework types are assignable.
type ExpressResponse = {
	headersSent?: boolean
	status(code: number): ExpressResponse
	setHeader(name: string, value: string): unknown
	json(body: unknown): unknown
}

/** Signature of the error handler returned by {@link expressErrorHandler}. */
export type ExpressErrorHandler = (
	err: unknown,
	req: ExpressRequest,
	res: ExpressResponse,
	next: ExpressNextFn,
) => void

/**
 * Returns a ready-to-use Express error handler that responds with RFC 9457
 * Problem Details JSON for any `HttpException`, and delegates everything else
 * (or anything raised after the response has started) to the next error handler.
 *
 * @example
 * ```ts
 * import { expressErrorHandler } from 'http-semantics'
 * app.use(expressErrorHandler())
 * ```
 */
export function expressErrorHandler(): ExpressErrorHandler {
	return function httpErrorHandler(err, _req, res, next) {
		// Headers already sent: Express' default handler must close the connection.
		if (res.headersSent || !(err instanceof HttpException)) {
			next(err)
			return
		}

		res.setHeader('Content-Type', PROBLEM_JSON_CONTENT_TYPE)
		res.status(err.problemDetails.status).json(err.problemDetails)
	}
}

// ─── Fastify ─────────────────────────────────────────────────────────────────

type FastifyRequest = {
	log: { error(obj: unknown, msg?: string): void; info(obj: unknown, msg?: string): void }
}
type FastifyReply = {
	code(status: number): FastifyReply
	header(name: string, value: string): FastifyReply
	send(body: unknown): unknown
}

/** Signature of the error handler returned by {@link fastifyErrorHandler}. */
export type FastifyErrorHandler = (
	err: unknown,
	request: FastifyRequest,
	reply: FastifyReply,
) => void

/**
 * Reads the `statusCode` Fastify (and its plugins) attach to their own errors,
 * e.g. 400 for schema validation failures or 413 for oversized bodies.
 */
function getErrorStatusCode(err: unknown): HttpStatusCode | undefined {
	if (typeof err !== 'object' || err === null || !('statusCode' in err)) return undefined
	const { statusCode } = err
	return isHttpStatusCode(statusCode) && statusCode >= 400 ? statusCode : undefined
}

/**
 * Returns a ready-to-use Fastify error handler that responds with RFC 9457
 * Problem Details JSON for any `HttpException`. Errors carrying a 4xx/5xx
 * `statusCode` (such as Fastify's validation errors) are converted to problem
 * details with that status; anything else falls back to a 500.
 *
 * 5xx errors are logged at `error` level and 4xx errors at `info` level,
 * matching Fastify's default error handler.
 *
 * @example
 * ```ts
 * import { fastifyErrorHandler } from 'http-semantics'
 * fastify.setErrorHandler(fastifyErrorHandler())
 * ```
 */
export function fastifyErrorHandler(
	fallbackMessage = 'Internal Server Error',
): FastifyErrorHandler {
	return function httpErrorHandler(err, request, reply) {
		let problemDetails: ProblemDetails | undefined
		if (err instanceof HttpException) {
			problemDetails = err.problemDetails
		} else {
			const status = getErrorStatusCode(err)
			if (status !== undefined) {
				problemDetails = {
					type: 'about:blank',
					status,
					title: getStatusPhrase(status) ?? 'Error',
					// Don't leak internal error messages for server errors.
					detail: status < 500 && err instanceof Error ? err.message : fallbackMessage,
					instance: '',
				}
			}
		}

		const status = problemDetails?.status ?? HttpStatus.INTERNAL_SERVER_ERROR
		if (status >= 500) request.log.error(err)
		else request.log.info({ err }, err instanceof Error ? err.message : 'Client error')

		if (problemDetails === undefined) {
			reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: fallbackMessage })
			return
		}

		reply.code(status).header('Content-Type', PROBLEM_JSON_CONTENT_TYPE).send(problemDetails)
	}
}

// ─── Hono ────────────────────────────────────────────────────────────────────

type HonoContext<TResponse> = {
	body(data: string, status: number, headers: Record<string, string>): TResponse
}

/**
 * Signature of the error handler returned by {@link honoErrorHandler}. `TResponse` is inferred
 * from `app.onError`, so no DOM `Response` type is required by this library.
 */
export type HonoErrorHandler<TResponse> = (err: unknown, c: HonoContext<TResponse>) => TResponse

/**
 * Hono's own `HTTPException` (thrown by e.g. `basicAuth` or `bodyLimit`) already
 * knows how to render itself, including headers such as `WWW-Authenticate`.
 */
function hasGetResponse(err: unknown): err is { getResponse(): unknown } {
	return (
		typeof err === 'object' &&
		err !== null &&
		'getResponse' in err &&
		typeof err.getResponse === 'function'
	)
}

/**
 * Returns a ready-to-use Hono error handler that responds with RFC 9457
 * Problem Details JSON for any `HttpException`, lets Hono's own `HTTPException`
 * render its response, and falls back to a 500 for other errors.
 *
 * @example
 * ```ts
 * import { honoErrorHandler } from 'http-semantics'
 * app.onError(honoErrorHandler())
 * ```
 */
export function honoErrorHandler<TResponse>(
	fallbackMessage = 'Internal Server Error',
): HonoErrorHandler<TResponse> {
	return function httpErrorHandler(err, c) {
		if (err instanceof HttpException) {
			return c.body(JSON.stringify(err.problemDetails), err.problemDetails.status, {
				'Content-Type': PROBLEM_JSON_CONTENT_TYPE,
			})
		}
		if (hasGetResponse(err)) {
			return err.getResponse() as TResponse
		}
		return c.body(JSON.stringify({ message: fallbackMessage }), HttpStatus.INTERNAL_SERVER_ERROR, {
			'Content-Type': 'application/json',
		})
	}
}
