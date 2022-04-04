import { UserModel } from "../types/models/UserModel";
import { BaseApi } from "./BaseApi";

export type SignInApiCreateResponseModel = {
    id: number
}

export class SignInApi extends BaseApi {


    create(data: { login: string, password: string }) {
        return this.instance.post<SignInApiCreateResponseModel>('auth/signin', data);
    }

    request() {
        return this.instance.get<UserModel>('auth/user');
    }
}