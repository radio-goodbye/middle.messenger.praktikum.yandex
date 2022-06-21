import { BaseApi } from './BaseApi';

export class SignOutApi extends BaseApi {
  create() {
    return this.instance.post('auth/logout');
  }
}