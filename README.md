# http-semantics

[![npm version](https://img.shields.io/npm/v/http-semantics?logo=npm)](https://www.npmjs.com/package/http-semantics)
[![npm downloads](https://img.shields.io/npm/dm/http-semantics)](https://www.npmjs.com/package/http-semantics)
[![types](https://img.shields.io/npm/types/http-semantics)](https://www.npmjs.com/package/http-semantics)
[![bundle size](https://deno.bundlejs.com/badge?q=http-semantics&treeshake=[*])](https://bundlejs.com/?q=http-semantics&treeshake=[*])
[![CI](https://github.com/Maikuh/http-semantics/actions/workflows/ci.yml/badge.svg)](https://github.com/Maikuh/http-semantics/actions/workflows/ci.yml)
[![Release](https://github.com/Maikuh/http-semantics/actions/workflows/release-and-publish.yml/badge.svg)](https://github.com/Maikuh/http-semantics/actions/workflows/release-and-publish.yml)
[![license](https://img.shields.io/npm/l/http-semantics)](LICENSE)

Zero-dependency TypeScript library that helps build HTTP APIs by providing exception classes (for 4xx
and 5xx status codes), status code / reason phrase enums, and ready-made error handlers for
Express, Fastify and Hono, based on the following RFCs:

- [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110) (HTTP Semantics - Standard)
- [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457) (Problem Details for HTTP APIs - Standard)
- [RFC 6585](https://www.rfc-editor.org/rfc/rfc6585) (Additional HTTP Status Codes - Proposed)
- [RFC 7725](https://www.rfc-editor.org/rfc/rfc7725) (451 Unavailable For Legal Reasons - Standard)

## Installation

```bash
npm i http-semantics
```

```bash
pnpm add http-semantics
```

```bash
yarn add http-semantics
```

```bash
bun add http-semantics
```

Requires Node.js 20 or later (or any modern runtime: Bun, Deno, browsers, edge workers). The package
is ESM-only; it can still be loaded with `require()` on Node.js 20.19+ and 22.12+, which support
`require(esm)`.

## Usage

### HTTP exceptions

Every named exception extends `HttpException`, which extends the global `Error`; they're meant to be
`throw`n. The constructor takes an RFC 9457 problem details object:

- `type` is **required**, since it identifies the problem type (use `'about:blank'` when the status
  code says it all).
- `instance` (a URI identifying this specific occurrence) is optional.
- `title` defaults to the status reason phrase and `detail` to a generic description.
- `status` is always set by the class.
- Any other member is kept as an RFC 9457 _extension member_.

```ts
import { BadRequestException, HttpException } from 'http-semantics'

try {
	throw new BadRequestException({
		type: 'https://problems-registry.smartbear.com/missing-body-property',
		instance: '/0cb0814e-c51f-4295-85e0-fad0bd2330d5',
		title: 'Missing body property',
		detail: 'The request is missing an expected body property.',
		// Extension members provide more context
		errors: [{ field: 'name', message: 'The body property "name" is required' }],
	})
} catch (error) {
	if (error instanceof HttpException) {
		console.log(error.problemDetails) // also what JSON.stringify(error) returns
	}
}
```

#### Typed extension members

Pass a type argument to get typed extension members on `problemDetails`:

```ts
import { UnprocessableContentException } from 'http-semantics'

type ValidationErrors = { errors: { field: string; message: string }[] }

const error = new UnprocessableContentException<ValidationErrors>({
	type: 'https://example.com/problems/validation',
	instance: '/users',
	errors: [{ field: 'email', message: 'Invalid email' }],
})

error.problemDetails.errors[0]?.field // string
```

#### Error chaining

Every exception accepts an optional second argument with a `cause`, just like `Error`:

```ts
try {
	await db.users.insert(user)
} catch (cause) {
	throw new ConflictException(
		{ type: '/problems/duplicate-user', instance: `/users/${id}` },
		{ cause },
	)
}
```

#### Response headers

Some status codes come with header fields that RFC 9110 requires or recommends. The related
exceptions accept them as typed options, and every exception accepts arbitrary `headers`. They're
exposed as `error.headers` (not part of the JSON body) and sent by the bundled framework handlers.

```ts
new UnauthorizedException(problem, { wwwAuthenticate: 'Bearer realm="api"' }) // WWW-Authenticate
new ProxyAuthenticationRequiredException(problem, { proxyAuthenticate: 'Basic realm="proxy"' }) // Proxy-Authenticate
new MethodNotAllowedException(problem, { allow: ['GET', 'HEAD'] }) // Allow: GET, HEAD
new UpgradeRequiredException(problem, { upgrade: ['HTTP/3.0'] }) // Upgrade
new RangeNotSatisfiableException(problem, { completeLength: 1024 }) // Content-Range: bytes */1024
new TooManyRequestsException(problem, { retryAfter: 30 }) // Retry-After: 30
new ServiceUnavailableException(problem, { retryAfter: new Date('2030-01-01') }) // Retry-After: <HTTP-date>
new ContentTooLargeException(problem, { retryAfter: 60 }) // Retry-After: 60

new NotFoundException(problem, { headers: { 'Cache-Control': 'no-store' } }) // any header
```

#### Creating exceptions dynamically

`createHttpException` returns the named exception for a status code, falling back to a plain
`HttpException` for codes without one (e.g. 418). `type` defaults to `'about:blank'`.

```ts
import { createHttpException, NotFoundException } from 'http-semantics'

const error = createHttpException({ status: 404, detail: 'No such user.' })
error instanceof NotFoundException // true
```

On the client side, `httpExceptionFromResponse` rebuilds an exception from a `fetch` response. It
parses problem details bodies, falls back to the status code for anything else, and copies
`Retry-After`, `Allow`, `WWW-Authenticate`, `Proxy-Authenticate` and `Upgrade` to `error.headers`:

```ts
import { httpExceptionFromResponse, TooManyRequestsException } from 'http-semantics'

const res = await fetch('https://api.example.com/users/1')
if (!res.ok) {
	const error = await httpExceptionFromResponse(res)
	if (error instanceof TooManyRequestsException) {
		console.log(`Retry in ${error.headers['Retry-After']}s`)
	}
	throw error
}
```

#### Available exceptions

| Status | Exception                              | Status | Exception                                |
| ------ | -------------------------------------- | ------ | ---------------------------------------- |
| 400    | `BadRequestException`                  | 417    | `ExpectationFailedException`             |
| 401    | `UnauthorizedException`                | 421    | `MisdirectedRequestException`            |
| 403    | `ForbiddenException`                   | 422    | `UnprocessableContentException`          |
| 404    | `NotFoundException`                    | 426    | `UpgradeRequiredException`               |
| 405    | `MethodNotAllowedException`            | 428    | `PreconditionRequiredException`          |
| 406    | `NotAcceptableException`               | 429    | `TooManyRequestsException`               |
| 407    | `ProxyAuthenticationRequiredException` | 431    | `RequestHeaderFieldsTooLargeException`   |
| 408    | `RequestTimeoutException`              | 451    | `UnavailableForLegalReasonsException`    |
| 409    | `ConflictException`                    | 500    | `InternalServerErrorException`           |
| 410    | `GoneException`                        | 501    | `NotImplementedException`                |
| 411    | `LengthRequiredException`              | 502    | `BadGatewayException`                    |
| 412    | `PreconditionFailedException`          | 503    | `ServiceUnavailableException`            |
| 413    | `ContentTooLargeException`             | 504    | `GatewayTimeoutException`                |
| 414    | `UriTooLongException`                  | 505    | `HttpVersionNotSupportedException`       |
| 415    | `UnsupportedMediaTypeException`        | 511    | `NetworkAuthenticationRequiredException` |
| 416    | `RangeNotSatisfiableException`         |        |                                          |

> Codes that RFC 9110 marks as reserved or unused have no exception (402 Payment Required,
> 418 (Unused)). For anything else, throw `HttpException` directly with a full problem details
> object.

### Framework error handlers

Each handler responds with the problem details as the body, the exception's `headers`, and
`Content-Type: application/problem+json`. They only rely on the parts of each framework's API they
use, so no framework is a dependency of this package.

#### Express

```ts
import { expressErrorHandler } from 'http-semantics'

// Register after your routes. Non-HttpException errors are passed to `next(err)`.
app.use(expressErrorHandler())
```

#### Fastify

```ts
import { fastifyErrorHandler } from 'http-semantics'

fastify.setErrorHandler(fastifyErrorHandler())
```

Errors that carry a 4xx/5xx `statusCode` (such as Fastify's schema validation errors) keep their
status and are converted to problem details. Any other error becomes a `500` problem details
response. Internal error messages are never sent for 5xx responses; pass a string as the first
argument to customize their `detail`.

#### Hono

```ts
import { honoErrorHandler } from 'http-semantics'

app.onError(honoErrorHandler())
```

Hono's own `HTTPException` (thrown by middleware such as `basicAuth` or `bodyLimit`) keeps its
original response. Any other error becomes a `500` problem details response without the internal
error message; pass a string as the first argument to customize its `detail`.

#### Other frameworks

```ts
import { HttpException, PROBLEM_JSON_CONTENT_TYPE } from 'http-semantics'

if (error instanceof HttpException) {
	return new Response(JSON.stringify(error), {
		status: error.problemDetails.status,
		headers: { ...error.headers, 'Content-Type': PROBLEM_JSON_CONTENT_TYPE },
	})
}
```

### Enums

```ts
import { HttpStatus, HttpStatusPhrase } from 'http-semantics'

HttpStatus.NOT_FOUND // 404
HttpStatusPhrase.NOT_FOUND // "Not Found"
```

### Utilities

```ts
import {
	getProblemDetails,
	getStatusPhrase,
	isClientError,
	isHttpException,
	isHttpStatusCode,
	isInformational,
	isRedirect,
	isServerError,
	isSuccess,
} from 'http-semantics'

isHttpException(error) // error is HttpException
isClientError(error) // HttpException with a 4xx status
isServerError(error) // HttpException with a 5xx status
getProblemDetails(error) // ProblemDetails | undefined

isHttpStatusCode(404) // true (narrows to HttpStatusCode)
getStatusPhrase(404) // "Not Found"
isInformational(101) // true
isSuccess(204) // true
isRedirect(308) // true
```

### Types

- `ProblemDetails<TExtensions>`: an RFC 9457 problem details object.
- `ProblemDetailsWithSomeDefaults<TExtensions>`: the input of every named exception.
- `HttpStatusCode`: union of every status code in `HttpStatus` (`100 | 101 | 200 | ...`).
- `HttpExceptionOptions`: `{ cause?: unknown; headers?: Record<string, string> }`, extended by
  `RetryAfterOptions`, `UnauthorizedOptions`, `ProxyAuthenticationRequiredOptions`,
  `MethodNotAllowedOptions`, `UpgradeRequiredOptions` and `RangeNotSatisfiableOptions`.
- `HttpExceptionInit`: the input of `createHttpException`.
- `ResponseLike`: the minimal `Response` shape read by `httpExceptionFromResponse`.

## Why?

I love Nest.js' way of throwing HTTP exceptions to respond to requests with errors (this is heavily
inspired by it). Nest isn't always used in the projects I've been in, and Nest overall isn't
commonly used (although the underlying platforms such as Express and Fastify are), so this aims to
bring a similar experience, with the twist of adhering to current HTTP/API standards.

## Development

```bash
bun install
```

```bash
bun run check # format check, lint (oxlint, type-aware), typecheck (TypeScript 7) and tests
```

```bash
bun run build # tsdown
```

## License

[MIT](LICENSE)
