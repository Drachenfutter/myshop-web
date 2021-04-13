import { doGet, doPost } from "../commons/fetch";
import { CONST } from "../commons/labels";
import { LoginRequest, NewUserRequest, User } from '../entity/user';

export async function registerNewUser(request: NewUserRequest): Promise<User> {
  const userBack = await doPost(CONST.BACKEND.BASE_URL + CONST.BACKEND.USER, request) as User;
  return userBack;
}

export async function login(request: LoginRequest): Promise<User> {
  const userBack = await doPost(CONST.BACKEND.BASE_URL + CONST.BACKEND.LOGIN, request) as User;
  return userBack;
}

export async function confirmEmailToken(token: string): Promise<User> {
  const user = await doGet(CONST.BACKEND.BASE_URL + CONST.BACKEND.CONFIRM_EMAIL +'/'+token) as User;
  return user;
}

export async function sendEmailConfirmation(email: string, jwt: string) {
  await doPost(CONST.BACKEND.BASE_URL + CONST.BACKEND.SEND_EMAIL, {userEmail: email}, jwt);
}