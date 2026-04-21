import { describe, expect, test } from 'bun:test'
import { InternalServerErrorException } from '../exceptions/internal-server-error.exception'
import { NotFoundException } from '../exceptions/not-found.exception'
import {
	getProblemDetails,
	isClientError,
	isHttpException,
	isInformational,
	isRedirect,
	isServerError,
	isSuccess,
} from './http.utils'

const baseInput = {
	type: 'https://example.com/problems/test',
	instance: '/errors/abc-123',
} as const

describe('isHttpException', () => {
	test('returns true for HttpException', () =>
		expect(isHttpException(new NotFoundException(baseInput))).toBe(true))
	test('returns false for plain Error', () =>
		expect(isHttpException(new Error('oops'))).toBe(false))
	test('returns false for null', () => expect(isHttpException(null)).toBe(false))
	test('returns false for string', () => expect(isHttpException('error')).toBe(false))
})

describe('isClientError', () => {
	test('returns true for 4xx exception', () =>
		expect(isClientError(new NotFoundException(baseInput))).toBe(true))
	test('returns false for 5xx exception', () =>
		expect(isClientError(new InternalServerErrorException(baseInput))).toBe(false))
	test('returns false for plain Error', () => expect(isClientError(new Error('oops'))).toBe(false))
})

describe('isServerError', () => {
	test('returns true for 5xx exception', () =>
		expect(isServerError(new InternalServerErrorException(baseInput))).toBe(true))
	test('returns false for 4xx exception', () =>
		expect(isServerError(new NotFoundException(baseInput))).toBe(false))
})

describe('isInformational / isSuccess / isRedirect', () => {
	test('100 is informational', () => expect(isInformational(100)).toBe(true))
	test('200 is success', () => expect(isSuccess(200)).toBe(true))
	test('301 is redirect', () => expect(isRedirect(301)).toBe(true))
	test('400 is not redirect', () => expect(isRedirect(400)).toBe(false))
})

describe('getProblemDetails', () => {
	test('returns problemDetails for HttpException', () => {
		const ex = new NotFoundException(baseInput)
		expect(getProblemDetails(ex)).toEqual(ex.problemDetails)
	})
	test('returns undefined for plain Error', () =>
		expect(getProblemDetails(new Error('oops'))).toBeUndefined())
})
