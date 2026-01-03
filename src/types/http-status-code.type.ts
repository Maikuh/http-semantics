import type { HttpStatus } from '../enums/http-status.enum'

/**
 * Union type of all HTTP status codes.
 */
export type HttpStatusCode = `${HttpStatus}` extends `${infer T extends number}` ? T : never
