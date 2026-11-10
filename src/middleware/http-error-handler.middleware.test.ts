import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'

import express from 'express'
import Fastify from 'fastify'
import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'

import { NotFoundException } from '../exceptions/not-found.exception'
import { TooManyRequestsException } from '../exceptions/too-many-requests.exception'
import { PROBLEM_JSON_CONTENT_TYPE } from '../types/problem-json.constant'
import {
	expressErrorHandler,
	fastifyErrorHandler,
	honoErrorHandler,
} from './http-error-handler.middleware'

const baseInput = {
	type: 'https://example.com/problems/test',
	instance: '/errors/abc-123',
} as const

const silentLogger = { level: 'silent' } as const

// ─── Express ─────────────────────────────────────────────────────────────────

describe('expressErrorHandler', () => {
	let server: Server
	let baseUrl: string
	let fallbackReached = false

	beforeAll(async () => {
		const app = express()
		app.get('/http', () => {
			throw new NotFoundException(baseInput)
		})
		app.get('/plain', () => {
			throw new Error('oops')
		})
		app.get('/limited', () => {
			throw new TooManyRequestsException(baseInput, { retryAfter: 30 })
		})
		app.get('/streaming', (_req, res) => {
			res.write('partial')
			throw new NotFoundException(baseInput)
		})
		app.use(expressErrorHandler())
		app.use(
			(err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
				fallbackReached = true
				if (res.headersSent) return next(err)
				res.status(500).send('fallback')
			},
		)
		await new Promise<void>((resolve) => {
			server = app.listen(0, () => resolve())
		})
		const { port } = server.address() as AddressInfo
		baseUrl = `http://localhost:${port}`
	})

	afterAll(() => {
		server.close()
	})

	test('responds with problem+json for HttpException', async () => {
		const res = await fetch(`${baseUrl}/http`)
		expect(res.status).toBe(404)
		expect(res.headers.get('content-type')).toStartWith(PROBLEM_JSON_CONTENT_TYPE)
		expect(await res.json()).toMatchObject({ ...baseInput, status: 404, title: 'Not Found' })
	})

	test('sends exception headers', async () => {
		const res = await fetch(`${baseUrl}/limited`)
		expect(res.status).toBe(429)
		expect(res.headers.get('retry-after')).toBe('30')
	})

	test('delegates other errors to the next handler', async () => {
		fallbackReached = false
		const res = await fetch(`${baseUrl}/plain`)
		expect(res.status).toBe(500)
		expect(await res.text()).toBe('fallback')
		expect(fallbackReached).toBe(true)
	})

	test('delegates when headers were already sent', async () => {
		fallbackReached = false
		await fetch(`${baseUrl}/streaming`)
			.then((res) => res.text())
			.catch(() => {})
		expect(fallbackReached).toBe(true)
	})
})

// ─── Fastify ─────────────────────────────────────────────────────────────────

describe('fastifyErrorHandler', () => {
	const app = Fastify({ logger: silentLogger })
	app.setErrorHandler(fastifyErrorHandler())
	app.get('/http', () => {
		throw new NotFoundException(baseInput)
	})
	app.get('/plain', () => {
		throw new Error('secret internals')
	})
	app.get('/limited', () => {
		throw new TooManyRequestsException(baseInput, { retryAfter: 30 })
	})
	app.post('/validated', { schema: { body: { type: 'object', required: ['name'] } } }, () => 'ok')

	afterAll(() => app.close())

	test('responds with problem+json for HttpException', async () => {
		const res = await app.inject({ method: 'GET', url: '/http' })
		expect(res.statusCode).toBe(404)
		expect(res.headers['content-type']).toStartWith(PROBLEM_JSON_CONTENT_TYPE)
		expect(res.json()).toMatchObject({ ...baseInput, status: 404, title: 'Not Found' })
	})

	test('sends exception headers', async () => {
		const res = await app.inject({ method: 'GET', url: '/limited' })
		expect(res.statusCode).toBe(429)
		expect(res.headers['retry-after']).toBe('30')
	})

	test('keeps the status code of Fastify validation errors', async () => {
		const res = await app.inject({ method: 'POST', url: '/validated', payload: {} })
		expect(res.statusCode).toBe(400)
		expect(res.headers['content-type']).toStartWith(PROBLEM_JSON_CONTENT_TYPE)
		expect(res.json()).toMatchObject({ type: 'about:blank', status: 400, title: 'Bad Request' })
	})

	test('falls back to 500 without leaking the error message', async () => {
		const res = await app.inject({ method: 'GET', url: '/plain' })
		expect(res.statusCode).toBe(500)
		expect(res.headers['content-type']).toStartWith(PROBLEM_JSON_CONTENT_TYPE)
		expect(res.json()).toMatchObject({ type: 'about:blank', status: 500 })
		expect(JSON.stringify(res.json())).not.toContain('secret internals')
	})
})

// ─── Hono ────────────────────────────────────────────────────────────────────

describe('honoErrorHandler', () => {
	const app = new Hono()
	app.onError(honoErrorHandler())
	app.get('/http', () => {
		throw new NotFoundException(baseInput)
	})
	app.get('/plain', () => {
		throw new Error('oops')
	})
	app.get('/limited', () => {
		throw new TooManyRequestsException(baseInput, { retryAfter: 30 })
	})
	app.use('/auth', basicAuth({ username: 'user', password: 'pass' }))
	app.get('/auth', (c) => c.text('ok'))

	test('responds with problem+json for HttpException', async () => {
		const res = await app.request('/http')
		expect(res.status).toBe(404)
		expect(res.headers.get('content-type')).toStartWith(PROBLEM_JSON_CONTENT_TYPE)
		expect(await res.json()).toMatchObject({ ...baseInput, status: 404, title: 'Not Found' })
	})

	test('sends exception headers', async () => {
		const res = await app.request('/limited')
		expect(res.status).toBe(429)
		expect(res.headers.get('retry-after')).toBe('30')
	})

	test("renders Hono's own HTTPException response", async () => {
		const res = await app.request('/auth')
		expect(res.status).toBe(401)
		expect(res.headers.get('www-authenticate')).toStartWith('Basic')
	})

	test('falls back to 500 for other errors', async () => {
		const res = await app.request('/plain')
		expect(res.status).toBe(500)
		expect(res.headers.get('content-type')).toStartWith(PROBLEM_JSON_CONTENT_TYPE)
		expect(await res.json()).toMatchObject({ type: 'about:blank', status: 500 })
	})
})
