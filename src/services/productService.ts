import { EditableProduct, ImageProduct, Product } from "../entity/product";
import { User } from "../entity/user";
import * as ProductResource from '../resources/product';
import { isLogged } from "./auth";

export function listProducts():Promise<Product[]>{
  const user = isLogged() as User;

  return new Promise( async (resolve, reject) => {
    try{
      resolve(await ProductResource.listProducts(user.token))
    }catch(err){
      reject({
        code: 100,
        message: 'Error: '+err.message
      })
    }
  });
}

export function setProduct(request: EditableProduct):Promise<Product>{
  const user = isLogged() as User;
  let newRequest: Product = {
    ...request,
    userId: user.id
  };

  if(request.isPublished){
    newRequest.publishedAt = new Date();
    newRequest.active = true;
  }

  if(!request.active){
    delete newRequest.publishedAt;
  }

  return new Promise( async (resolve, reject) => {
    try{
      if(request.id){
        resolve(await ProductResource.updateProduct(newRequest, user.token));
      }else{
        resolve(await ProductResource.createProduct(newRequest, user.token));
      }
    }catch(err){
      reject({
        code: 100,
        message: 'Error: '+err.message
      })
    }
  });
}

export function saveImage(form: FormData, productId: string) {
  const user = isLogged() as User;

  return new Promise( async (resolve, reject) => {
    try{
      resolve(await ProductResource.saveImageProduct(productId, form, user.token))
    }catch(err){
      reject({
        code: 100,
        message: 'Error: '+err.message
      })
    }
  });
}

export function listImages(productId: string):Promise<ImageProduct[]>{
  return new Promise( async (resolve, reject) => {
    try{
      resolve(await ProductResource.listImages(productId))
    }catch(err){
      reject({
        code: 100,
        message: err.message
      })
    }
  });
}

export function deleteImage(productId: string, imageId: string) {
  return new Promise( async (resolve, reject) => {
    try{
      const user = isLogged() as User;
      resolve(await ProductResource.deleteImage(productId, imageId, user.token))
    }catch(err){
      reject({
        code: 100,
        message: err.message
      })
    }
  });
}