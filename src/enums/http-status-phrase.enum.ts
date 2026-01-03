/**
 * Human-readable HTTP status reason phrases (RFC 9110)
 */
export enum HttpStatusPhrase {
	// 1xx Informational
	CONTINUE = 'Continue',
	SWITCHING_PROTOCOLS = 'Switching Protocols',

	// 2xx Successful
	OK = 'OK',
	CREATED = 'Created',
	ACCEPTED = 'Accepted',
	NON_AUTHORITATIVE_INFORMATION = 'Non-Authoritative Information',
	NO_CONTENT = 'No Content',
	RESET_CONTENT = 'Reset Content',
	PARTIAL_CONTENT = 'Partial Content',

	// 3xx Redirection
	MULTIPLE_CHOICES = 'Multiple Choices',
	MOVED_PERMANENTLY = 'Moved Permanently',
	FOUND = 'Found',
	SEE_OTHER = 'See Other',
	NOT_MODIFIED = 'Not Modified',
	TEMPORARY_REDIRECT = 'Temporary Redirect',
	PERMANENT_REDIRECT = 'Permanent Redirect',

	// 4xx Client Errors
	BAD_REQUEST = 'Bad Request',
	UNAUTHORIZED = 'Unauthorized',
	PAYMENT_REQUIRED = 'Payment Required',
	FORBIDDEN = 'Forbidden',
	NOT_FOUND = 'Not Found',
	METHOD_NOT_ALLOWED = 'Method Not Allowed',
	NOT_ACCEPTABLE = 'Not Acceptable',
	REQUEST_TIMEOUT = 'Request Timeout',
	CONFLICT = 'Conflict',
	GONE = 'Gone',
	LENGTH_REQUIRED = 'Length Required',
	PRECONDITION_FAILED = 'Precondition Failed',
	CONTENT_TOO_LARGE = 'Content Too Large',
	URI_TOO_LONG = 'URI Too Long',
	UNSUPPORTED_MEDIA_TYPE = 'Unsupported Media Type',
	RANGE_NOT_SATISFIABLE = 'Range Not Satisfiable',
	EXPECTATION_FAILED = 'Expectation Failed',
	MISDIRECTED_REQUEST = 'Misdirected Request',
	UNPROCESSABLE_CONTENT = 'Unprocessable Content',
	UPGRADE_REQUIRED = 'Upgrade Required',
	PRECONDITION_REQUIRED = 'Precondition Required',
	TOO_MANY_REQUESTS = 'Too Many Requests',
	REQUEST_HEADER_FIELDS_TOO_LARGE = 'Request Header Fields Too Large',

	// 5xx Server Errors
	INTERNAL_SERVER_ERROR = 'Internal Server Error',
	NOT_IMPLEMENTED = 'Not Implemented',
	BAD_GATEWAY = 'Bad Gateway',
	SERVICE_UNAVAILABLE = 'Service Unavailable',
	GATEWAY_TIMEOUT = 'Gateway Timeout',
	HTTP_VERSION_NOT_SUPPORTED = 'HTTP Version Not Supported',
}
