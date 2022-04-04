import { UserModel } from "../types/models/UserModel";
import { BaseApi } from "./BaseApi";

export class UserProfileApi extends BaseApi {
    update(data: {
        id: number,
        first_name: string,
        second_name: string,
        display_name: string,
        login: string,
        email: string,
        phone: string,
    }) {
        return this.instance.put<UserModel>('user/profile', {first_name: data.first_name,
        second_name: data.second_name,
        display_name: data.display_name,
        login: data.login,
        email: data.email,
        phone: data.phone});
    }

    request(data: { id: number }) {
        return this.instance.get<UserModel>('user/' + data.id, {});
    }
}