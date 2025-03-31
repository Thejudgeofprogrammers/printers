export class SaveUserSessionRequest {
    userId: number;
    jwtToken: string;
}

export class SaveUserSessionResponse {
    message: string;
}

export class GetUserSessionResponse {
    userId: number; 
    jwtToken: string; 
}

export class DeleteUserSessionRequest {
    userId: string;
}

export class DeleteUserSessionResponse {
    message: string;
    status: number;
}
