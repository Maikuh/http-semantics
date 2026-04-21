import { describe, expect, test } from 'bun:test'
import { HttpException } from './http.exception'
import { NotFoundException } from './not-found.exception'

const baseInput = {
	type: 'https://example.com/problems/test',
	instance: '/errors/abc-123',
} as const

describe('HttpException', () => {
	test('stores problem details', () => {
		const ex = new HttpException({
			type: baseInput.type,
			instance: baseInput.instance,
			status: 400,
			title: 'Bad Request',
			detail: 'Something was wrong.',
		})
		expect(ex.problemDetails.type).toBe(baseInput.type)
		expect(ex.problemDetails.instance).toBe(baseInput.instance)
		expect(ex.problemDetails.status).toBe(400)
		expect(ex.problemDetails.title).toBe('Bad Request')
		expect(ex.problemDetails.detail).toBe('Something was wrong.')
	})

	test('message is "<title> - <detail>"', () => {
		const ex = new HttpException({
			...baseInput,
			status: 500,
			title: 'Error',
			detail: 'Details here.',
		})
		expect(ex.message).toBe('Error - Details here.')
	})

	test('name is set to class name automatically', () => {
		const ex = new HttpException({
			...baseInput,
			status: 500,
			title: 'Error',
			detail: 'Details here.',
		})
		expect(ex.name).toBe('HttpException')
	})

	test('is an instance of Error', () => {
		const ex = new HttpException({ ...baseInput, status: 500, title: 'T', detail: 'D' })
		expect(ex).toBeInstanceOf(Error)
	})

	test('toJSON() returns a plain ProblemDetails object', () => {
		const ex = new HttpException({ ...baseInput, status: 500, title: 'T', detail: 'D' })
		const json = ex.toJSON()
		expect(json).toEqual(ex.problemDetails)
		expect(JSON.stringify(ex)).toBe(JSON.stringify(ex.problemDetails))
	})

	test('supports cause option for error chaining', () => {
		const rootCause = new Error('DB connection failed')
		const ex = new HttpException(
			{ ...baseInput, status: 500, title: 'T', detail: 'D' },
			{ cause: rootCause },
		)
		expect((ex as Error & { cause: unknown }).cause).toBe(rootCause)
	})

	test('subclass instanceof checks work', () => {
		const ex = new NotFoundException(baseInput)
		expect(ex).toBeInstanceOf(HttpException)
		expect(ex).toBeInstanceOf(NotFoundException)
		expect(ex).toBeInstanceOf(Error)
	})
})
