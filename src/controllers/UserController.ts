import { UserAvatarApi } from "../api/UserAvatarApi";
import { UserPasswordApi } from "../api/UserPasswordApi";
import { UserProfileApi } from "../api/UserProfileApi";
import { Controller } from "./Controller";

export class UserController extends Controller {

    userProfileApi: UserProfileApi = new UserProfileApi();
    userPasswordApi: UserPasswordApi = new UserPasswordApi();
    userAvatarApi: UserAvatarApi = new UserAvatarApi();

    load_user(data: { id: number }) {
        this.userProfileApi.request(data)
            .then(data => {
                this.store.set("user", data, 'load_user:complete');
            })
            .catch(err => {
                this.store.set("error", { code: err.code, text: err.data.reason }, 'load_user:error');

            });
    }

    update_user_data(data: {
        "id": number
        "first_name": string,
        "second_name": string,
        "display_name": string,
        "login": string,
        "email": string,
        "phone": string,
        "avatar"?: FormData,
        oldPassword: string,
        newPassword: string
    }) {
        this.userProfileApi.update(data)
            .then(() =>
                this.userPasswordApi.update({ oldPassword: data.oldPassword, newPassword: data.newPassword })
            )
            .then(() => data.avatar ? this.userAvatarApi.update(data.avatar) : null)
            .then(() => {
                this.store.set("user", data, 'settings_save:complete');
                location.reload()
            })
            .catch(err => {
                this.store.set("error", { code: err.code, text: err.data.reason }, 'settings_save:error');
            })
    }

}