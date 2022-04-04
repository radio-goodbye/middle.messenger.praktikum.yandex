import { BaseApi } from "./BaseApi";

export class UserPasswordApi extends BaseApi {
    update(data: { oldPassword: string, newPassword: string }) {
       return  this.instance.put<string>('user/password', { oldPassword: data.oldPassword, newPassword: data.newPassword })
    }
}