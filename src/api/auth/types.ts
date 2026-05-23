export interface AuthUserPayload {
  name: string
  password: string
}

export interface AuthLoginData {
  token: string
  userId: string
}

export interface AuthApiResponse<T = unknown> {
  code: number
  msg: string
  data: T
}
