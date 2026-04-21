import { describe, expect, test } from 'bun:test'
import { HttpStatus } from './http-status.enum'
import { HttpStatusPhrase } from './http-status-phrase.enum'

describe('HttpStatus', () => {
	test('OK is 200', () => expect(HttpStatus.OK).toBe(200))
	test('NOT_FOUND is 404', () => expect(HttpStatus.NOT_FOUND).toBe(404))
	test('INTERNAL_SERVER_ERROR is 500', () => expect(HttpStatus.INTERNAL_SERVER_ERROR).toBe(500))
	test('PROXY_AUTHENTICATION_REQUIRED is 407', () =>
		expect(HttpStatus.PROXY_AUTHENTICATION_REQUIRED).toBe(407))
	test('UNAVAILABLE_FOR_LEGAL_REASONS is 451', () =>
		expect(HttpStatus.UNAVAILABLE_FOR_LEGAL_REASONS).toBe(451))
	test('NETWORK_AUTHENTICATION_REQUIRED is 511', () =>
		expect(HttpStatus.NETWORK_AUTHENTICATION_REQUIRED).toBe(511))
})

describe('HttpStatusPhrase', () => {
	test('OK is "OK"', () => expect(HttpStatusPhrase.OK).toBe('OK'))
	test('NOT_FOUND is "Not Found"', () => expect(HttpStatusPhrase.NOT_FOUND).toBe('Not Found'))
})
