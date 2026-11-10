import { describe, expect, test } from 'bun:test'

import { BadRequestException } from './bad-request.exception'
import { createHttpException, httpExceptionFromResponse } from './create-http-exception'
import { HttpException } from './http.exception'
import { NotFoundException } from './not-found.exception'
import { ServiceUnavailableException } from './service-unavailable.exception'
import { UriTooLongException } from './uri-too-long.exception'

describe('createHttpException', () => {
	test('returns the named exception for the status', () => {
		const ex = createHttpException({ status: 404, detail: 'No such user.' })
		expect(ex).toBeInstanceOf(NotFoundException)
		expect(ex.name).toBe('NotFoundException')
		expect(ex.problemDetails).toEqual({
			type: 'about:blank',
			status: 404,
			title: 'Not Found',
			detail: 'No such user.',
		})
	})

	test('maps every named status', () => {
		expect(createHttpException({ status: 414 })).toBeInstanceOf(UriTooLongException)
		expect(createHttpException({ status: 503 })).toBeInstanceOf(ServiceUnavailableException)
	})

	test('keeps provided members and extensions', () => {
		const ex = createHttpException({
			status: 400,
			type: '/problems/x',
			instance: '/i',
			title: 'Custom',
			errors: ['a'],
		})
		expect(ex).toBeInstanceOf(BadRequestException)
		expect(ex.problemDetails).toMatchObject({
			type: '/problems/x',
			instance: '/i',
			title: 'Custom',
			errors: ['a'],
		})
	})

	test('falls back to HttpException for codes without a named class', () => {
		const ex = createHttpException({ status: 418 })
		expect(ex.constructor).toBe(HttpException)
		expect<number>(ex.problemDetails.status).toBe(418)
		expect(ex.problemDetails.title).toBe('Client Error')
	})

	test('uses the phrase of known codes without a named class', () => {
		expect(createHttpException({ status: 402 }).problemDetails.title).toBe('Payment Required')
	})

	test('forwards options', () => {
		const cause = new Error('root')
		const ex = createHttpException({ status: 500 }, { cause, headers: { 'X-A': '1' } })
		expect(ex.cause).toBe(cause)
		expect(ex.headers).toEqual({ 'X-A': '1' })
	})

	test('rejects non-error status codes', () => {
		expect(() => createHttpException({ status: 200 })).toThrow(RangeError)
		expect(() => createHttpException({ status: 600 })).toThrow(RangeError)
		expect(() => createHttpException({ status: 404.5 })).toThrow(RangeError)
	})
})

describe('httpExceptionFromResponse', () => {
	test('rebuilds an exception from a problem+json response', async () => {
		const body = {
			type: '/problems/missing',
			status: 404 as const,
			title: 'Missing',
			detail: 'Gone fishing.',
			instance: '/users/1',
			userId: 1,
		}
		const res = new Response(JSON.stringify(body), {
			status: 404,
			headers: { 'Content-Type': 'application/problem+json' },
		})
		const ex = await httpExceptionFromResponse(res)
		expect(ex).toBeInstanceOf(NotFoundException)
		expect(ex.problemDetails).toEqual(body)
	})

	test('round-trips an exception serialized by this library', async () => {
		const original = new NotFoundException({ type: '/p', instance: '/i', extra: true })
		const res = new Response(JSON.stringify(original), {
			status: 404,
			headers: { 'Content-Type': 'application/problem+json' },
		})
		expect((await httpExceptionFromResponse(res)).problemDetails).toEqual(original.problemDetails)
	})

	test('uses the response status over the body status', async () => {
		const res = new Response(JSON.stringify({ status: 400 }), {
			status: 503,
			headers: { 'Content-Type': 'application/json' },
		})
		const ex = await httpExceptionFromResponse(res)
		expect(ex).toBeInstanceOf(ServiceUnavailableException)
	})

	test('builds from the status alone for non-JSON bodies', async () => {
		const res = new Response('<h1>Bad Gateway</h1>', {
			status: 502,
			headers: { 'Content-Type': 'text/html' },
		})
		const ex = await httpExceptionFromResponse(res)
		expect(ex.problemDetails).toMatchObject({
			type: 'about:blank',
			status: 502,
			title: 'Bad Gateway',
		})
	})

	test('ignores invalid JSON', async () => {
		const res = new Response('{not json', {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		})
		expect(await httpExceptionFromResponse(res)).toBeInstanceOf(BadRequestException)
	})

	test('drops standard members with the wrong type', async () => {
		const res = new Response(JSON.stringify({ title: 42, detail: ['x'], type: null }), {
			status: 400,
			headers: { 'Content-Type': 'application/problem+json' },
		})
		const ex = await httpExceptionFromResponse(res)
		expect(ex.problemDetails.title).toBe('Bad Request')
		expect(ex.problemDetails.type).toBe('about:blank')
		expect(typeof ex.problemDetails.detail).toBe('string')
	})

	test('copies relevant response headers', async () => {
		const res = new Response(null, {
			status: 429,
			headers: { 'Retry-After': '30', 'Set-Cookie': 'a=b' },
		})
		const ex = await httpExceptionFromResponse(res, { headers: { 'X-Mine': '1' } })
		expect(ex.headers).toEqual({ 'Retry-After': '30', 'X-Mine': '1' })
	})

	test('rejects successful responses', async () => {
		const error: unknown = await httpExceptionFromResponse(
			new Response('ok', { status: 200 }),
		).catch((e: unknown) => e)
		expect(error).toBeInstanceOf(RangeError)
	})
})
