export interface User {
    id: string
    name: string
    email: string
}

export interface UserDataAdditionalUser {
    email: string
    name: string
}

export interface Credentials {
    email: string
    password: string
}

export interface RegisterCredentials extends Credentials {
    name: string
}

export interface RequestPasswordResetPayload {
    email: string
}

export interface ResetPasswordPayload {
    token: string
    email: string
    password: string
    password_confirmation: string
}
