import { doDelete, doGet, doPost, doPut } from "../commons/fetch";
import { CONST } from "../commons/labels";
import { ImageProduct, Product } from '../entity/product';

export async function listProducts(jwt?: string): Promise<Product[]> {
  const products = await doGet(CONST.BACKEND.BASE_URL + CONST.BACKEND.PRODUCTS, jwt) as Product[];
  return products;
}

export async function createProduct(request: Product, jwt: string): Promise<Product> {
  const product = await doPost(CONST.BACKEND.BASE_URL + CONST.BACKEND.PRODUCT, request, jwt) as Product;
  return product;
}

export async function updateProduct(request: Product, jwt: string): Promise<Product> {
  const product = await doPut(CONST.BACKEND.BASE_URL + CONST.BACKEND.PRODUCT, request, jwt) as Product;
  return product;
}

export async function saveImageProduct(productId: string, data: FormData, jwt: string): Promise<Product> {
  const resp = await doPost(
    CONST.BACKEND.BASE_URL + CONST.BACKEND.PRODUCT + CONST.BACKEND.IMAGE + '/'+productId, data, jwt, true) as Product;
  return resp;
}

export async function listImages(productId: string): Promise<ImageProduct[]> {
  const images = await doGet(CONST.BACKEND.BASE_URL + CONST.BACKEND.PRODUCT + '/'+productId + CONST.BACKEND.IMAGE) as ImageProduct[];
  return images;
}

export async function deleteImage(productId: string, imageId: string, jwt: string): Promise<ImageProduct[]> {
  const images = await doDelete(CONST.BACKEND.BASE_URL + CONST.BACKEND.PRODUCT + '/'+
    productId + CONST.BACKEND.IMAGE + '/' + imageId, null, jwt) as ImageProduct[];
  return images;
}