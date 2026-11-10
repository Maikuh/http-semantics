// Smoke test for the built package (`dist`), run with plain Node.js after `bun run build`.
// Imports the package by its own name (package self-reference), so the `exports` map is used
// exactly as consumers see it. Catches packaging bugs unit tests can't, e.g. minified class
// names or a broken `require()` entry point.
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const esm = await import('http-semantics')
const cjs = createRequire(import.meta.url)('http-semantics')

for (const [label, mod] of [
	['import', esm],
	['require', cjs],
]) {
	const error = new mod.NotFoundException({ type: 'about:blank', instance: '/x' })
	assert.ok(error instanceof mod.HttpException, `${label}: instanceof HttpException`)
	assert.ok(error instanceof Error, `${label}: instanceof Error`)
	assert.equal(error.name, 'NotFoundException', `${label}: class name is preserved`)
	assert.equal(error.problemDetails.status, 404, `${label}: status`)
	assert.equal(mod.HttpStatus.NOT_FOUND, 404, `${label}: enums`)
	assert.equal(mod.createHttpException({ status: 429 }).name, 'TooManyRequestsException')
}

assert.equal(esm.NotFoundException, cjs.NotFoundException, 'import and require share one module')

console.log(`Smoke test passed on Node.js ${process.version}`)
