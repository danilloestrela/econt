export class UserAlreadyExistsError extends Error {
  constructor(message: string = "User already exists") {
    super(message)
  }
}

export class UserNeedsEmailToRegisterError extends Error {
  constructor(message: string = "User needs an email to register") {
    super(message)
  }
}

export class UserInvalidCredentialsError extends Error {
  constructor(message: string = "User has invalid credentials") {
    super(message)
  }
}

export class UserSessionNotFoundError extends Error {
  constructor(message: string = "Session not found") {
    super(message)
  }
}

export class UserSessionExpiredError extends Error {
  constructor(message: string = "Session has expired") {
    super(message)
  }
}

export class UserDoesNotExistsError extends Error {
  constructor(message: string = "User does not exists") {
    super(message)
  }
}