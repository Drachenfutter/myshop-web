import axios, { AxiosRequestConfig } from 'axios';
import { handleHttpError } from '../entity/fail';

export async function doGet(url: string, jwt?: string) {
  return doRequest('GET', url, undefined, jwt);
}

export async function doPost(url: string, data?: any, jwt?: string, sendAsMultipart?: boolean) {
  return doRequest('POST', url, data, jwt, sendAsMultipart);
}

export async function doPut(url: string, data?: any, jwt?: string) {
  return doRequest('PUT', url, data, jwt);
}

export async function doDelete(url: string, data?: any, jwt?: string) {
  return doRequest('DELETE', url, data, jwt);
}

async function doRequest(method: AxiosRequestConfig["method"], url: string, data?: any, jwt?: string, sendAsMultipart?: boolean) {
  let config: AxiosRequestConfig = {
    url: url,
    method: method,
    data: data
  };

  if(jwt){
    config.headers = {
        authorization: 'authorization '+ jwt,
    }
  }
  if(sendAsMultipart){
    config.headers = {
      ...config.headers,
      'Content-Type': 'multipart/form-data; boundary='+data.boundary
    };
  }

  return new Promise( (resolve, reject)=>{
    axios.request(config)
    .then( data => {
      resolve(data.data);
    })
    .catch( async err => {
      reject(handleHttpError(await err));
    });
  });
}