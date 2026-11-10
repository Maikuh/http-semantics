import { createHttpException } from '../exceptions/create-http-exception'
import { HttpException } from '../exceptions/http.exception'
import { InternalServerErrorException } from '../exceptions/internal-server-error.exception'
import { PROBLEM_JSON_CONTENT_TYPE } from '../types/problem-json.constant'

/**
 * Returns the 500 problem details sent for errors that aren't `HttpException`s.
 * `detail` defaults to the `InternalServerErrorException` one.
 */
function fallbackException(detail: string | undefined): HttpException {
	return new InternalServerErrorException({ type: 'about:blank', detail })
}

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
 * Problem Details JSON (plus `error.headers`) for any `HttpException`, and
 * delegates everything else (or anything raised after the response has
 * started) to the next error handler.
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

		for (const [name, value] of Object.entries(err.headers)) res.setHeader(name, value)
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
function getErrorStatusCode(err: unknown): number | undefined {
	if (typeof err !== 'object' || err === null || !('statusCode' in err)) return undefined
	const { statusCode } = err
	return typeof statusCode === 'number' &&
		Number.isInteger(statusCode) &&
		statusCode >= 400 &&
		statusCode < 600
		? statusCode
		: undefined
}

/**
 * Returns a ready-to-use Fastify error handler that responds with RFC 9457
 * Problem Details JSON (plus `error.headers`) for any `HttpException`.
 * Errors carrying a 4xx/5xx `statusCode` (such as Fastify's validation errors)
 * are converted to problem details with that status; anything else becomes a
 * 500 problem details response.
 *
 * 5xx errors are logged at `error` level and 4xx errors at `info` level,
 * matching Fastify's default error handler.
 *
 * @param fallbackDetail - `detail` sent for 5xx errors that aren't `HttpException`s,
 * so internal error messages are never leaked.
 *
 * @example
 * ```ts
 * import { fastifyErrorHandler } from 'http-semantics'
 * fastify.setErrorHandler(fastifyErrorHandler())
 * ```
 */
export function fastifyErrorHandler(fallbackDetail?: string): FastifyErrorHandler {
	return function httpErrorHandler(err, request, reply) {
		let exception: HttpException
		if (err instanceof HttpException) {
			exception = err
		} else {
			const status = getErrorStatusCode(err)
			exception =
				status === undefined
					? fallbackException(fallbackDetail)
					: createHttpException({
							status,
							detail: status < 500 && err instanceof Error ? err.message : fallbackDetail,
						})
		}

		const { status } = exception.problemDetails
		if (status >= 500) request.log.error(err)
		else request.log.info({ err }, err instanceof Error ? err.message : 'Client error')

		for (const [name, value] of Object.entries(exception.headers)) reply.header(name, value)
		reply
			.code(status)
			.header('Content-Type', PROBLEM_JSON_CONTENT_TYPE)
			.send(exception.problemDetails)
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
 * Problem Details JSON (plus `error.headers`) for any `HttpException`, lets
 * Hono's own `HTTPException` render its response, and responds with 500
 * problem details for other errors.
 *
 * @param fallbackDetail - `detail` sent for errors that aren't `HttpException`s,
 * so internal error messages are never leaked.
 *
 * @example
 * ```ts
 * import { honoErrorHandler } from 'http-semantics'
 * app.onError(honoErrorHandler())
 * ```
 */
export function honoErrorHandler<TResponse>(fallbackDetail?: string): HonoErrorHandler<TResponse> {
	return function httpErrorHandler(err, c) {
		if (!(err instanceof HttpException) && hasGetResponse(err)) {
			return err.getResponse() as TResponse
		}

		const exception = err instanceof HttpException ? err : fallbackException(fallbackDetail)
		return c.body(JSON.stringify(exception.problemDetails), exception.problemDetails.status, {
			...exception.headers,
			'Content-Type': PROBLEM_JSON_CONTENT_TYPE,
		})
	}
}
