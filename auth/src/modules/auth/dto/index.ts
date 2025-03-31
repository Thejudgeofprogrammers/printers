export class ToHashPasswordResponse {
    hashedPassword: string
}

export class ToHashPasswordRequest {
    password: string
}

export class LoginRequest {
    email: string
    password: string
    passwordHash: string
    userId: number
}

export class LoginResponse {
    userId: number
    jwtToken: string
}

export class CheckPasswordRequest {
    password: string
    hashedPassword: string
}

export class CheckPasswordResponse {
    exist: boolean
}

export class RegisterRequest {
    username: string
    email: string
    password: string
}

export class RegisterResponse {
    username: string
    email: string
    passwordHash: string
}
