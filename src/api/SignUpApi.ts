import { BaseApi } from "./BaseApi";

export type SignUpApiCreateResponseModel = {
    id: number
}

export class SignUpApi extends BaseApi {
    create(data: {
        login: string,
        password: string,
        email: string,
        first_name: string,
        second_name: string,
        phone: string
    }) {
        return this.instance.post<SignUpApiCreateResponseModel>('auth/signup', data);
    }
}