export interface User {
  id: string;
  name: string;
  email: string;
  token: string,
  lastAccess: Date;
  emailConfirmedAt?: Date;
}

export interface NewUserRequest {
  name: string,
  email: string,
  password: string
}

export interface LoginRequest {
  email: string,
  password: string
}