import { Dictionary } from '../types/Dictionary';

/** Методы запросов */
export enum METHODS{
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/** Параметры запроса */
export type QueryParams = {
  timeout?: number
  method? : METHODS,
  data? : Dictionary,
  headers?: { [id: string]: string }
};

/** HTTP-запрос */
export class Query<T> {
  /**
     * Послать GET запрос
     * @param url URL
     * @param options Параметры запросы
     * @returns
     */
  get(url: string, options?: QueryParams): Promise<T> {
    let URL = url;
    if (options?.data){
      URL = `${url}?${this._queryStringify(options?.data)}`;
    }
    return this._request(URL, { ...options, method: METHODS.GET });
  }

  /**
     * Послать PUT запрос
     * @param url URL
     * @param options Параметры запросы
     * @returns
     */
  put(url: string, options?: QueryParams): Promise<T> {
    return this._request(url, { ...options, method: METHODS.PUT });
  }

  /**
     * Послать POST запрос
     * @param url URL
     * @param options Параметры запросы
     * @returns
     */
  post(url: string, options?: QueryParams) : Promise<T> {
    return this._request(url, { ...options, method: METHODS.POST });
  }

  /**
     * Послать DELETE запрос
     * @param url URL
     * @param options Параметры запросы
     * @returns
     */
  delete(url: string, options?: QueryParams) : Promise<T> {
    return this._request(url, { ...options, method: METHODS.DELETE });
  }

  /**
     *  Форматировать объект в строку для GET запроса
     * @param data Объект
     * @returns
     */
  private _queryStringify(data: Dictionary): string {
    const arr = [];
    for (const i in data) {
      arr.push(`${i}=${data}`);
    }
    return arr.join('&');
  }

  /**
     * Послать запрос
     * @param url URL
     * @param options Параметры запроса
     * @returns
     */
  private _request(url : string, options: QueryParams) : Promise<T> {
    const { method } = options;
    const { data } = options;
    const timeout = options?.timeout ?? 60000;
    const { headers } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method!, url);

      xhr.timeout = timeout;
      if (headers) {
        for (const i in headers) {
          xhr.setRequestHeader(i, headers[i]);
        }
      }
      xhr.onload = function () {
        resolve(xhr as any);
      };

      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.ontimeout = reject;

      if (method === METHODS.GET || !data) {
        xhr.send();
      } else {
        xhr.send(data as XMLHttpRequestBodyInit);
      }
    });
  }
}