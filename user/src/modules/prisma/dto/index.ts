export class UpdateUserPasswordResponse {
    message
    status
}

export class UpdateUserPasswordRequest {
    password
    userId
}

export class CreateNewUserRequest {
    username
    email
    passwordHash
}