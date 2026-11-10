import { describe, expect, test } from 'bun:test'

import { ContentTooLargeException } from './content-too-large.exception'
import { HttpException } from './http.exception'
import { MethodNotAllowedException } from './method-not-allowed.exception'
import { NotFoundException } from './not-found.exception'
import { ProxyAuthenticationRequiredException } from './proxy-authentication-required.exception'
import { ServiceUnavailableException } from './service-unavailable.exception'
import { TooManyRequestsException } from './too-many-requests.exception'
import { UnauthorizedException } from './unauthorized.exception'
import { UpgradeRequiredException } from './upgrade-required.exception'

const baseInput = {
	type: 'https://example.com/problems/test',
	instance: '/errors/abc-123',
} as const

describe('Exception headers', () => {
	test('default to an empty object', () => {
		expect(new NotFoundException(baseInput).headers).toEqual({})
	})

	test('accept arbitrary headers on any exception', () => {
		const ex = new NotFoundException(baseInput, { headers: { 'Cache-Control': 'no-store' } })
		expect(ex.headers).toEqual({ 'Cache-Control': 'no-store' })
	})

	test('are not part of the serialized problem details', () => {
		const ex = new TooManyRequestsException(baseInput, { retryAfter: 5 })
		expect(JSON.stringify(ex)).not.toContain('Retry-After')
	})

	test('are copied from the options object', () => {
		const headers = { 'X-Test': 'a' }
		const ex = new HttpException(
			{ ...baseInput, status: 500, title: 'T', detail: 'D' },
			{ headers },
		)
		headers['X-Test'] = 'b'
		expect(ex.headers['X-Test']).toBe('a')
	})

	test('options without cause do not set a cause', () => {
		const ex = new NotFoundException(baseInput, { headers: {} })
		expect('cause' in ex).toBe(false)
	})

	test('typed options still forward cause', () => {
		const cause = new Error('root')
		expect(new TooManyRequestsException(baseInput, { retryAfter: 1, cause }).cause).toBe(cause)
	})
})

describe('retryAfter', () => {
	for (const Cls of [
		TooManyRequestsException,
		ServiceUnavailableException,
		ContentTooLargeException,
	]) {
		test(`${Cls.name} sets Retry-After in seconds`, () => {
			expect(new Cls(baseInput, { retryAfter: 120 }).headers['Retry-After']).toBe('120')
		})
	}

	test('rounds fractional seconds up', () => {
		expect(
			new TooManyRequestsException(baseInput, { retryAfter: 1.2 }).headers['Retry-After'],
		).toBe('2')
	})

	test('formats dates as HTTP-date', () => {
		const date = new Date(Date.UTC(2026, 0, 2, 3, 4, 5))
		expect(new ServiceUnavailableException(baseInput, { retryAfter: date }).headers).toEqual({
			'Retry-After': 'Fri, 02 Jan 2026 03:04:05 GMT',
		})
	})

	test('rejects negative or non-finite values', () => {
		expect(() => new TooManyRequestsException(baseInput, { retryAfter: -1 })).toThrow(RangeError)
		expect(() => new TooManyRequestsException(baseInput, { retryAfter: Number.NaN })).toThrow(
			RangeError,
		)
	})

	test('is omitted when not given', () => {
		expect(new TooManyRequestsException(baseInput).headers).toEqual({})
	})

	test('wins over the same header in options.headers', () => {
		const ex = new TooManyRequestsException(baseInput, {
			retryAfter: 10,
			headers: { 'Retry-After': '99', 'X-Other': 'kept' },
		})
		expect(ex.headers).toEqual({ 'Retry-After': '10', 'X-Other': 'kept' })
	})
})

describe('Challenge and list headers', () => {
	test('UnauthorizedException sets WWW-Authenticate', () => {
		const ex = new UnauthorizedException(baseInput, {
			wwwAuthenticate: ['Bearer realm="api"', 'Basic realm="api"'],
		})
		expect(ex.headers['WWW-Authenticate']).toBe('Bearer realm="api", Basic realm="api"')
	})

	test('ProxyAuthenticationRequiredException sets Proxy-Authenticate', () => {
		const ex = new ProxyAuthenticationRequiredException(baseInput, {
			proxyAuthenticate: 'Basic realm="proxy"',
		})
		expect(ex.headers['Proxy-Authenticate']).toBe('Basic realm="proxy"')
	})

	test('MethodNotAllowedException sets Allow', () => {
		const ex = new MethodNotAllowedException(baseInput, { allow: ['GET', 'HEAD'] })
		expect(ex.headers.Allow).toBe('GET, HEAD')
	})

	test('MethodNotAllowedException allows an empty Allow list', () => {
		expect(new MethodNotAllowedException(baseInput, { allow: [] }).headers.Allow).toBe('')
	})

	test('UpgradeRequiredException sets Upgrade', () => {
		const ex = new UpgradeRequiredException(baseInput, { upgrade: ['HTTP/3.0'] })
		expect(ex.headers.Upgrade).toBe('HTTP/3.0')
	})
})
