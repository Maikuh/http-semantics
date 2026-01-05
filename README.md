# http-semantics

<a href="https://www.npmjs.com/package/http-semantics" target="_blank"><img src="https://badgen.net/npm/v/http-semantics"></a>
<a href="https://www.npmjs.com/package/http-semantics" target="_blank"><img src="https://badgen.net/npm/dm/http-semantics"></a>
<a href="https://www.npmjs.com/package/http-semantics" target="_blank"><img src="https://badgen.net/npm/types/http-semantics"></a>
<a href="https://bundlephobia.com/package/http-semantics" target="_blank"><img src="https://badgen.net/bundlephobia/minzip/http-semantics"></a>
![Release and NPM Publish Action](https://github.com/Maikuh/http-semantics/actions/workflows/release-and-publish.yml/badge.svg)
<a href="LICENSE" target="_blank"><img src="https://badgen.net/static/license/MIT/green"></a>

Typescript library designed to help in HTTP APIs creation by providing exceptions classes (for 400 and 500 status codes) and 
status codes / phrases enums based on the following RFCs:
- [RFC 9110](https://datatracker.ietf.org/doc/html/rfc9110) (HTTP Semantics - Standard)
- [RFC 9457](https://datatracker.ietf.org/doc/html/rfc9457) (Problem Details for HTTP APIs - Standard)
- [RFC 6585](https://datatracker.ietf.org/doc/html/rfc6585) (Additional HTTP Status Codes - Proposed)


## Installation

```bash
# Using NPM
$ npm i http-semantics

# Using Yarn
$ yarn add http-semantics

# Using PNPM
$ pnpm add http-semantics

# Using Bun
$ bun add http-semantics
```

## Usage
### HTTP Exceptions
These are classes that extend the base `HttpException` class which is actually extending the global `Error` class; they're meant to be `throw`n. They take a `ProblemDetails` object as their constructor param, with some defaults to the `title`, `detail` and `status` properties. Since `instance` and `type` are meant to be "unique" for each error, these will be required.

#### General idea without framework/library
```ts
import { HttpException, BadRequestException } from 'http-semantics'

try {
    throw new BadRequestException({
        instance: '/0cb0814e-c51f-4295-85e0-fad0bd2330d5',
        type: 'https://problems-registry.smartbear.com/missing-body-property',
        title: 'Missing body property', //
        detail: 'The request is missing an expected body property.',
        // any additional objects (called "extensions" in the RFC) that can provide more context
        errors: [
            {
                message: 'The body property "name" is required',
                field: 'name'
            }
        ]  
    })
} catch (error) {
    if (error instanceof HttpException) {
        console.log(error.problemDetails)
    }
}
```

#### Express.js
```ts
import { HttpException } from 'http-semantics'

// Catch all error handler
app.use((err, req, res, next) => {
    if (err instanceof HttpException) {
        res.status(err.problemDetails.status).json(err.problemDetails)
        return
    }

    next(err)
})
```

#### Fastify
```ts
import { HttpException } from 'http-semantics'

// Register parent error handler
fastify.setErrorHandler((error, request, reply) => {
    req.log.error(err)

    if (err instanceof HttpException) {
        return res.code(err.problemDetails.status).send(err.problemDetails)
    }

    // Default behavior
    reply.status(500).send('Internal Server Error')
})
```

#### Hono
```ts
import { HttpException, HttpStatus } from 'http-semantics'

app.onError((err, c) => {
	console.error(`${err}`)

	if (err instanceof HttpException) {
		return c.json(err.problemDetails, err.problemDetails.status as ContentfulStatusCode)
	}

	return c.json({ message: 'Internal Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR)
})
```

### Enums
```ts
import { HttpStatus, HttpStatusPhrase } from 'http-semantics'

HttpStatus.NOT_FOUND // 200
HttpStatusPhrase.NOT_FOUND // "Not Found"
```

> Some codes/exceptions were skipped due to them being placeholders, as mentioned by the RFC 9110 (e.g. 402 - Payment Required and 418 - Unused)

## Why?
I love Nest.js' way of throwing HTTP exceptions to respond to requests with errors (this is heavily inspired by it). Nest isn't always used in the projects I've been in, also Nest overall isn't commonly used (although the underlying platforms such as Express/Fastify are), so this aims to hopefully bring a similar experience, but with the twist of adhering to current HTTP/API standards.

## License
[MIT](LICENSE)
