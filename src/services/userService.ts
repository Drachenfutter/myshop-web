import { LoginRequest, NewUserRequest, User } from '../entity/user';
import * as UserResource from '../resources/user';
import { isLogged } from './auth';

export async function newUser(request: NewUserRequest): Promise<User>{
  return new Promise( async (resolve, reject) => {
    try{
      resolve(await UserResource.registerNewUser(request))
    }catch(err){
      reject({
            code: 100,
            message: +err.message
          })
    }
  });
}

export async function login(request: LoginRequest): Promise<User>{
  return new Promise( async (resolve, reject) => {
    try{
      resolve(await UserResource.login(request))
    }catch(err){
      reject({
            code: 100,
            message: err.message
          })
    }
  });
}

export async function sendEmailConfirmation(userEmail: string) {
  try{
    const user = await isLogged() as User;
    await UserResource.sendEmailConfirmation(userEmail, user.token);
  }catch(err){
    throw new Error(`Fail to confirm email: ${err.message}`);
  }
}

export async function confirmEmail(token: string): Promise<User> {
  try{
    return await UserResource.confirmEmailToken(token);
  }catch(err){
    throw new Error(err.message);
  }
}