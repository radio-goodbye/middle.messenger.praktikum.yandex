import { Dictionary } from '../types/Dictionary';
import { Query } from './Query';

/** Работа с HTTP-запросами */
export class HTTP {
  /** Урл для запросов */
  private _baseUrl: string;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  get<T>(url: string, data?: Dictionary): Promise<T> {
    return (new Query<T>()).get(`${this._baseUrl}/${url}`, { data });
  }

  post<T>(url: string, data?: Dictionary): Promise<T> {
    return (new Query<T>()).post(`${this._baseUrl}/${url}`, { data });
  }

  put<T>(url: string, data?: Dictionary): Promise<T> {
    return (new Query<T>()).put(`${this._baseUrl}/${url}`, { data });
  }

  delete<T>(url: string, data?: Dictionary): Promise<T> {
    return (new Query<T>()).delete(`${this._baseUrl}/${url}`, { data });
  }
}

