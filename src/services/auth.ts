import { CONST } from "../commons/labels";
import { User } from "../entity/user";

export function isLogged():User|boolean{
  const localUser = localStorage.getItem(CONST.LOCAL_STORAGE_USER_KEY);
  let userLogged: User;
  try{
    if(localUser){
      userLogged = JSON.parse(localUser);
      return userLogged;
    }else{
      return false;
    }
  }catch(err){
    return false;
  }
};