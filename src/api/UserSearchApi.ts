import { UserModel } from '../types/models/UserModel';
import { BaseApi } from './BaseApi';

export class UserSearchApi extends BaseApi {
  request(data: { login: string }) {
    return this.instance.post<UserModel[]>('user/search', { login: data.login });
  }
}