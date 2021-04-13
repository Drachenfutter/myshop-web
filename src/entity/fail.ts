export interface Fail {
  statusCode?: number,
  errorCode: number,
  message: string,
  detail?: string
}

export function handleHttpError(error: any): Fail{
  let finalError: Fail;
  let _error: any = error.response ? error.response.data : error;
  if(!_error || !_error.message || !_error.errorCode){
    finalError = {
      errorCode: 500,
      detail: JSON.stringify(_error),
      message: ''
    }
    finalError.message = _error.message ? _error.message : _error;
  }else{
    finalError = {
      errorCode: _error.errorCode,
      message: _error.message,
      detail: _error.detail,
      statusCode: _error.statusCode
    }
  }
  return finalError;
}