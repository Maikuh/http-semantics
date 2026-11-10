import { HttpStatus } from '../enums/http-status.enum'
import type { HttpExceptionOptions } from '../types/http-exception-options.type'
import type { HttpStatusCode } from '../types/http-status-code.type'
import type { ProblemDetails, ProblemDetailsWithSomeDefaults } from '../types/problem-details.type'
import { getStatusPhrase } from '../utils/status.utils'
import { BadGatewayException } from './bad-gateway.exception'
import { BadRequestException } from './bad-request.exception'
import { ConflictException } from './conflict.exception'
import { ContentTooLargeException } from './content-too-large.exception'
import { ExpectationFailedException } from './expectation-failed.exception'
import { ForbiddenException } from './forbidden.exception'
import { GatewayTimeoutException } from './gateway-timeout.exception'
import { GoneException } from './gone.exception'
import { HttpVersionNotSupportedException } from './http-version-not-supported.exception'
import { HttpException } from './http.exception'
import { InternalServerErrorException } from './internal-server-error.exception'
import { LengthRequiredException } from './length-required.exception'
import { MethodNotAllowedException } from './method-not-allowed.exception'
import { MisdirectedRequestException } from './misdirected-request.exception'
import { NetworkAuthenticationRequiredException } from './network-authentication-required.exception'
import { NotAcceptableException } from './not-acceptable.exception'
import { NotFoundException } from './not-found.exception'
import { NotImplementedException } from './not-implemented.exception'
import { PreconditionFailedException } from './precondition-failed.exception'
import { PreconditionRequiredException } from './precondition-required.exception'
import { ProxyAuthenticationRequiredException } from './proxy-authentication-required.exception'
import { RangeNotSatisfiableException } from './range-not-satisfiable.exception'
import { RequestHeaderFieldsTooLargeException } from './request-header-fields-too-large.exception'
import { RequestTimeoutException } from './request-timeout.exception'
import { ServiceUnavailableException } from './service-unavailable.exception'
import { TooManyRequestsException } from './too-many-requests.exception'
import { UnauthorizedException } from './unauthorized.exception'
import { UnavailableForLegalReasonsException } from './unavailable-for-legal-reasons.exception'
import { UnprocessableContentException } from './unprocessable-content.exception'
import { UnsupportedMediaTypeException } from './unsupported-media-type.exception'
import { UpgradeRequiredException } from './upgrade-required.exception'
import { UriTooLongException } from './uri-too-long.exception'

type NamedExceptionConstructor = new (
	problemDetails: ProblemDetailsWithSomeDefaults,
	options?: HttpExceptionOptions,
) => HttpException

const exceptionsByStatus: Partial<Record<number, NamedExceptionConstructor>> = {
	[HttpStatus.BAD_GATEWAY]: BadGatewayException,
	[HttpStatus.BAD_REQUEST]: BadRequestException,
	[HttpStatus.CONFLICT]: ConflictException,
	[HttpStatus.CONTENT_TOO_LARGE]: ContentTooLargeException,
	[HttpStatus.EXPECTATION_FAILED]: ExpectationFailedException,
	[HttpStatus.FORBIDDEN]: ForbiddenException,
	[HttpStatus.GATEWAY_TIMEOUT]: GatewayTimeoutException,
	[HttpStatus.GONE]: GoneException,
	[HttpStatus.HTTP_VERSION_NOT_SUPPORTED]: HttpVersionNotSupportedException,
	[HttpStatus.INTERNAL_SERVER_ERROR]: InternalServerErrorException,
	[HttpStatus.LENGTH_REQUIRED]: LengthRequiredException,
	[HttpStatus.METHOD_NOT_ALLOWED]: MethodNotAllowedException,
	[HttpStatus.MISDIRECTED_REQUEST]: MisdirectedRequestException,
	[HttpStatus.NETWORK_AUTHENTICATION_REQUIRED]: NetworkAuthenticationRequiredException,
	[HttpStatus.NOT_ACCEPTABLE]: NotAcceptableException,
	[HttpStatus.NOT_FOUND]: NotFoundException,
	[HttpStatus.NOT_IMPLEMENTED]: NotImplementedException,
	[HttpStatus.PRECONDITION_FAILED]: PreconditionFailedException,
	[HttpStatus.PRECONDITION_REQUIRED]: PreconditionRequiredException,
	[HttpStatus.PROXY_AUTHENTICATION_REQUIRED]: ProxyAuthenticationRequiredException,
	[HttpStatus.RANGE_NOT_SATISFIABLE]: RangeNotSatisfiableException,
	[HttpStatus.REQUEST_HEADER_FIELDS_TOO_LARGE]: RequestHeaderFieldsTooLargeException,
	[HttpStatus.REQUEST_TIMEOUT]: RequestTimeoutException,
	[HttpStatus.SERVICE_UNAVAILABLE]: ServiceUnavailableException,
	[HttpStatus.TOO_MANY_REQUESTS]: TooManyRequestsException,
	[HttpStatus.UNAUTHORIZED]: UnauthorizedException,
	[HttpStatus.UNAVAILABLE_FOR_LEGAL_REASONS]: UnavailableForLegalReasonsException,
	[HttpStatus.UNPROCESSABLE_CONTENT]: UnprocessableContentException,
	[HttpStatus.UNSUPPORTED_MEDIA_TYPE]: UnsupportedMediaTypeException,
	[HttpStatus.UPGRADE_REQUIRED]: UpgradeRequiredException,
	[HttpStatus.URI_TOO_LONG]: UriTooLongException,
}

/**
 * Input of {@link createHttpException}: a status code plus any (possibly partial)
 * problem details members.
 */
export type HttpExceptionInit = {
	status: number
	type?: string
	title?: string
	detail?: string
	instance?: string
	[extension: string]: unknown
}

/**
 * Creates the named exception matching `status` (e.g. `NotFoundException` for 404), falling
 * back to a plain `HttpException` for 4xx/5xx codes without a named class (e.g. 418).
 *
 * `type` defaults to `'about:blank'` (as RFC 9457 specifies) and `instance` to `''`.
 *
 * @throws {RangeError} if `status` is not an integer between 400 and 599.
 *
 * @example
 * ```ts
 * const error = createHttpException({ status: 404, detail: 'No such user.' })
 * error instanceof NotFoundException // true
 * ```
 */
export function createHttpException(
	{ status, type = 'about:blank', instance = '', title, detail, ...extensions }: HttpExceptionInit,
	options?: HttpExceptionOptions,
): HttpException {
	if (!Number.isInteger(status) || status < 400 || status > 599) {
		throw new RangeError(`Expected a 4xx or 5xx status code, got ${status}`)
	}

	const Exception = exceptionsByStatus[status]
	if (Exception) {
		return new Exception({ ...extensions, type, instance, title, detail }, options)
	}

	const problemDetails: ProblemDetails = {
		type,
		// Codes outside `HttpStatus` are still valid HTTP; the union only lists registered ones.
		status: status as HttpStatusCode,
		title: title ?? getStatusPhrase(status) ?? (status < 500 ? 'Client Error' : 'Server Error'),
		detail: detail ?? '',
		instance,
		...extensions,
	}
	return new HttpException(problemDetails, options)
}

/** Minimal `Response` shape read by {@link httpExceptionFromResponse} (e.g. a fetch `Response`). */
export type ResponseLike = {
	status: number
	headers: { get(name: string): string | null }
	text(): Promise<string>
}

/** Response headers carried over to `error.headers`. */
const FORWARDED_HEADERS = [
	'Allow',
	'Proxy-Authenticate',
	'Retry-After',
	'Upgrade',
	'WWW-Authenticate',
] as const

function readProblemMembers(body: unknown): Omit<HttpExceptionInit, 'status'> {
	if (typeof body !== 'object' || body === null || Array.isArray(body)) return {}
	// `status` comes from the response itself, which is authoritative (RFC 9457 §3.1.2).
	const { status: _status, ...members } = body as Record<string, unknown>
	// Drop standard members with the wrong type, as RFC 9457 §3.1 requires.
	for (const key of ['type', 'title', 'detail', 'instance'] as const) {
		if (typeof members[key] !== 'string') delete members[key]
	}
	return members
}

/**
 * Rebuilds an exception from an HTTP error response, e.g. on the client side of an API that
 * uses this library. Problem details bodies (`application/problem+json` or any JSON) are
 * parsed; otherwise the exception is built from the status code alone. `Retry-After`, `Allow`,
 * `WWW-Authenticate`, `Proxy-Authenticate` and `Upgrade` are copied to `error.headers`.
 *
 * @throws {RangeError} if the response status is not 4xx/5xx.
 *
 * @example
 * ```ts
 * const res = await fetch('/api/users/1')
 * if (!res.ok) throw await httpExceptionFromResponse(res)
 * ```
 */
export async function httpExceptionFromResponse(
	response: ResponseLike,
	options?: HttpExceptionOptions,
): Promise<HttpException> {
	let members: Omit<HttpExceptionInit, 'status'> = {}
	if (response.headers.get('Content-Type')?.includes('json')) {
		try {
			members = readProblemMembers(JSON.parse(await response.text()))
		} catch {
			// Not valid JSON: fall back to the status code alone.
		}
	}

	const headers: Record<string, string> = {}
	for (const name of FORWARDED_HEADERS) {
		const value = response.headers.get(name)
		if (value !== null) headers[name] = value
	}

	return createHttpException(
		{ ...members, status: response.status },
		{ ...options, headers: { ...headers, ...options?.headers } },
	)
}
