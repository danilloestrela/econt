export class NotFoundError extends Error {
    constructor({what, message}: {what: string, message?: string}) {
        super(message || `${what} not found`)
    }
}

export class NotCreatedError extends Error {
    constructor({what, message}: {what: string, message?: string}) {
        super(message || `${what} not created`)
    }
}

export class ValidationError extends Error {
    constructor({what, message}: {what: string, message?: string}) {
        super(message || `${what} validation failed`)
    }
}