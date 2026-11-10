import { describe, expect, test } from 'bun:test'

import { HttpStatusPhrase } from './http-status-phrase.enum'
import { HttpStatus } from './http-status.enum'

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
	test('OK is "OK"', () => expect<string>(HttpStatusPhrase.OK).toBe('OK'))
	test('NOT_FOUND is "Not Found"', () =>
		expect<string>(HttpStatusPhrase.NOT_FOUND).toBe('Not Found'))
	test('URI_TOO_LONG is "URI Too Long"', () =>
		expect<string>(HttpStatusPhrase.URI_TOO_LONG).toBe('URI Too Long'))
})

describe('HttpStatus / HttpStatusPhrase parity', () => {
	test('both enums declare exactly the same keys', () => {
		const statusKeys = Object.keys(HttpStatus).filter((k) => Number.isNaN(Number(k)))
		expect(statusKeys.toSorted()).toEqual(Object.keys(HttpStatusPhrase).toSorted())
	})
})
