import { ChatModel } from "../types/models/ChatModel";
import { BaseApi } from "./BaseApi";


export class ChatListApi extends BaseApi {
    request() {
        return this.instance.get<ChatModel[]>('chats');
    }

    create(data: {name: string}) {
        return this.instance.post<ChatModel[]>('chats', {title: data.name});
    }
}