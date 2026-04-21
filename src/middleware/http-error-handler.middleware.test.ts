import { describe, expect, test } from 'bun:test'
import { NotFoundException } from '../exceptions/not-found.exception'
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

// ─── Shared mock types ────────────────────────────────────────────────────────

type MockReply = {
	code: (c: number) => MockReply
	header: (name: string, value: string) => MockReply
	send: (b: unknown) => void
}

// ─── expressErrorHandler ─────────────────────────────────────────────────────

describe('expressErrorHandler', () => {
	test('handles HttpException with correct status and content-type', () => {
		const handler = expressErrorHandler()
		const err = new NotFoundException(baseInput)

		let capturedStatus = 0
		let capturedHeader = ''
		let capturedBody: unknown

		type MockRes = {
			status: (code: number) => MockRes
			setHeader: (name: string, value: string) => MockRes
			json: (body: unknown) => void
		}
		const res: MockRes = {
			status(code: number) {
				capturedStatus = code
				return res
			},
			setHeader(name: string, value: string) {
				capturedHeader = `${name}: ${value}`
				return res
			},
			json(body: unknown) {
				capturedBody = body
			},
		}
		let nextCalled = false
		const emptyReq = { method: 'GET', url: '/' }
		handler(err, emptyReq, res, () => {
			nextCalled = true
		})

		expect(capturedStatus).toBe(404)
		expect(capturedHeader).toBe(`Content-Type: ${PROBLEM_JSON_CONTENT_TYPE}`)
		expect((capturedBody as Record<string, unknown>).status).toBe(404)
		expect(nextCalled).toBe(false)
	})

	test('calls next() for non-HttpException errors', () => {
		const handler = expressErrorHandler()
		let nextCalled = false
		const emptyReq = { method: 'GET', url: '/' }
		const emptyRes = { status: () => emptyRes, setHeader: () => emptyRes, json: () => {} }
		handler(new Error('oops'), emptyReq, emptyRes, () => {
			nextCalled = true
		})
		expect(nextCalled).toBe(true)
	})
})

// ─── fastifyErrorHandler ──────────────────────────────────────────────────────

describe('fastifyErrorHandler', () => {
	test('sends problem details for HttpException', () => {
		const handler = fastifyErrorHandler()
		const err = new NotFoundException(baseInput)

		let capturedCode = 0
		let capturedBody: unknown
		const reply: MockReply = {
			code(c: number) {
				capturedCode = c
				return reply
			},
			header(_name: string, _value: string) {
				return reply
			},
			send(b: unknown) {
				capturedBody = b
			},
		}
		const mockRequest = { log: { error: (_err: unknown) => {} } }
		handler(err, mockRequest, reply)

		expect(capturedCode).toBe(404)
		expect((capturedBody as Record<string, unknown>).status).toBe(404)
	})

	test('sends 500 for non-HttpException errors', () => {
		const handler = fastifyErrorHandler()
		let capturedCode = 0
		const reply: MockReply = {
			code(c: number) {
				capturedCode = c
				return reply
			},
			header(_name: string, _value: string) {
				return reply
			},
			send(_b: unknown) {},
		}
		const mockRequest = { log: { error: (_err: unknown) => {} } }
		handler(new Error('oops'), mockRequest, reply)
		expect(capturedCode).toBe(500)
	})
})

// ─── honoErrorHandler ─────────────────────────────────────────────────────────

describe('honoErrorHandler', () => {
	test('returns problem details response for HttpException', () => {
		const handler = honoErrorHandler()
		const err = new NotFoundException(baseInput)

		let capturedBody: unknown
		let capturedStatus = 0
		const c = {
			json(body: unknown, status: number): Response {
				capturedBody = body
				capturedStatus = status
				return new Response(JSON.stringify(body), { status })
			},
		}
		handler(err, c)
		expect(capturedStatus).toBe(404)
		expect((capturedBody as Record<string, unknown>).status).toBe(404)
	})

	test('returns 500 for non-HttpException', () => {
		const handler = honoErrorHandler()
		let capturedStatus = 0
		const c = {
			json(_body: unknown, status: number): Response {
				capturedStatus = status
				return new Response(null, { status })
			},
		}
		handler(new Error('oops'), c)
		expect(capturedStatus).toBe(500)
	})
})
