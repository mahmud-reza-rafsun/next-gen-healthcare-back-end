export interface IRegisterPatientPayload {
    name: string,
    email: string,
    password: string
}

export interface ILoginUserPayload {
    email: string,
    password: string
}

export interface IChnagePasswordPayload {
    currentPassword: string,
    newPassword: string
}