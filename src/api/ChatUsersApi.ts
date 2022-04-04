import { ChatUserModel } from "../types/models/ChatUserModel";
import { BaseApi } from "./BaseApi";

export class ChatUsersApi extends BaseApi{
    request(data: {id: number}) {
        return this.instance.get<ChatUserModel[]>(`chats/${data.id}/users`);
    }

    create(data: {id: number, userId: number}) {
        return this.instance.put<any>('chats/users', {chatId: data.id, users:[data.userId]});
    }
}