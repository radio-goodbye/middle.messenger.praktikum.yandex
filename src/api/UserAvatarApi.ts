import { BaseApi } from './BaseApi';

export class UserAvatarApi extends BaseApi{
  update(file: FormData) {
    return this.instance.put<string>('user/profile/avatar', file);
  }
}