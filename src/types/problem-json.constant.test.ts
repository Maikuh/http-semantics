import { describe, expect, test } from 'bun:test'
import { PROBLEM_JSON_CONTENT_TYPE } from './problem-json.constant'

describe('PROBLEM_JSON_CONTENT_TYPE', () => {
	test('equals application/problem+json', () => {
		expect(PROBLEM_JSON_CONTENT_TYPE).toBe('application/problem+json')
	})
})
