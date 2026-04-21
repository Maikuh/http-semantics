import { describe, expect, test } from 'bun:test'
import { HttpStatusPhrase } from '../enums/http-status-phrase.enum'
import { BadGatewayException } from './bad-gateway.exception'
import { BadRequestException } from './bad-request.exception'
import { ConflictException } from './conflict.exception'
import { ContentTooLargeException } from './content-too-large.exception'
import { ExpectationFailedException } from './expectation-failed.exception'
import { ForbiddenException } from './forbidden.exception'
import { GatewayTimeoutException } from './gateway-timeout.exception'
import { GoneException } from './gone.exception'
import { HttpException } from './http.exception'
import { HttpVersionNotSupportedException } from './http-version-not-supported.exception'
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

const baseInput = {
	type: 'https://example.com/problems/test',
	instance: '/errors/abc-123',
} as const

const exceptionCases = [
	{ Cls: BadRequestException, status: 400, phrase: HttpStatusPhrase.BAD_REQUEST },
	{ Cls: UnauthorizedException, status: 401, phrase: HttpStatusPhrase.UNAUTHORIZED },
	{ Cls: ForbiddenException, status: 403, phrase: HttpStatusPhrase.FORBIDDEN },
	{ Cls: NotFoundException, status: 404, phrase: HttpStatusPhrase.NOT_FOUND },
	{ Cls: MethodNotAllowedException, status: 405, phrase: HttpStatusPhrase.METHOD_NOT_ALLOWED },
	{ Cls: NotAcceptableException, status: 406, phrase: HttpStatusPhrase.NOT_ACCEPTABLE },
	{
		Cls: ProxyAuthenticationRequiredException,
		status: 407,
		phrase: HttpStatusPhrase.PROXY_AUTHENTICATION_REQUIRED,
	},
	{ Cls: RequestTimeoutException, status: 408, phrase: HttpStatusPhrase.REQUEST_TIMEOUT },
	{ Cls: ConflictException, status: 409, phrase: HttpStatusPhrase.CONFLICT },
	{ Cls: GoneException, status: 410, phrase: HttpStatusPhrase.GONE },
	{ Cls: LengthRequiredException, status: 411, phrase: HttpStatusPhrase.LENGTH_REQUIRED },
	{ Cls: PreconditionFailedException, status: 412, phrase: HttpStatusPhrase.PRECONDITION_FAILED },
	{ Cls: ContentTooLargeException, status: 413, phrase: HttpStatusPhrase.CONTENT_TOO_LARGE },
	{
		Cls: UnsupportedMediaTypeException,
		status: 415,
		phrase: HttpStatusPhrase.UNSUPPORTED_MEDIA_TYPE,
	},
	{
		Cls: RangeNotSatisfiableException,
		status: 416,
		phrase: HttpStatusPhrase.RANGE_NOT_SATISFIABLE,
	},
	{ Cls: ExpectationFailedException, status: 417, phrase: HttpStatusPhrase.EXPECTATION_FAILED },
	{ Cls: MisdirectedRequestException, status: 421, phrase: HttpStatusPhrase.MISDIRECTED_REQUEST },
	{
		Cls: UnprocessableContentException,
		status: 422,
		phrase: HttpStatusPhrase.UNPROCESSABLE_CONTENT,
	},
	{ Cls: UpgradeRequiredException, status: 426, phrase: HttpStatusPhrase.UPGRADE_REQUIRED },
	{
		Cls: PreconditionRequiredException,
		status: 428,
		phrase: HttpStatusPhrase.PRECONDITION_REQUIRED,
	},
	{ Cls: TooManyRequestsException, status: 429, phrase: HttpStatusPhrase.TOO_MANY_REQUESTS },
	{
		Cls: RequestHeaderFieldsTooLargeException,
		status: 431,
		phrase: HttpStatusPhrase.REQUEST_HEADER_FIELDS_TOO_LARGE,
	},
	{
		Cls: UnavailableForLegalReasonsException,
		status: 451,
		phrase: HttpStatusPhrase.UNAVAILABLE_FOR_LEGAL_REASONS,
	},
	{
		Cls: InternalServerErrorException,
		status: 500,
		phrase: HttpStatusPhrase.INTERNAL_SERVER_ERROR,
	},
	{ Cls: NotImplementedException, status: 501, phrase: HttpStatusPhrase.NOT_IMPLEMENTED },
	{ Cls: BadGatewayException, status: 502, phrase: HttpStatusPhrase.BAD_GATEWAY },
	{ Cls: ServiceUnavailableException, status: 503, phrase: HttpStatusPhrase.SERVICE_UNAVAILABLE },
	{ Cls: GatewayTimeoutException, status: 504, phrase: HttpStatusPhrase.GATEWAY_TIMEOUT },
	{
		Cls: HttpVersionNotSupportedException,
		status: 505,
		phrase: HttpStatusPhrase.HTTP_VERSION_NOT_SUPPORTED,
	},
	{
		Cls: NetworkAuthenticationRequiredException,
		status: 511,
		phrase: HttpStatusPhrase.NETWORK_AUTHENTICATION_REQUIRED,
	},
]

describe('Named exceptions', () => {
	for (const { Cls, status, phrase } of exceptionCases) {
		describe(Cls.name, () => {
			test(`sets status to ${status}`, () => {
				const ex = new Cls(baseInput)
				expect(ex.problemDetails.status).toBe(status)
			})

			test(`uses default title "${phrase}"`, () => {
				const ex = new Cls(baseInput)
				expect(ex.problemDetails.title).toBe(phrase)
			})

			test('allows overriding title', () => {
				const ex = new Cls({ ...baseInput, title: 'Custom title' })
				expect(ex.problemDetails.title).toBe('Custom title')
			})

			test('allows overriding detail', () => {
				const ex = new Cls({ ...baseInput, detail: 'Custom detail.' })
				expect(ex.problemDetails.detail).toBe('Custom detail.')
			})

			test('name matches class name', () => {
				const ex = new Cls(baseInput)
				expect(ex.name).toBe(Cls.name)
			})

			test('passes through extension fields', () => {
				const ex = new Cls({ ...baseInput, errors: [{ field: 'email', message: 'required' }] })
				expect((ex.problemDetails as Record<string, unknown>).errors).toEqual([
					{ field: 'email', message: 'required' },
				])
			})

			test('is instanceof HttpException', () => {
				const ex = new Cls(baseInput)
				expect(ex).toBeInstanceOf(HttpException)
			})
		})
	}
})
