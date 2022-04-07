import { ChatUserModel } from "./ChatUserModel";

export type ChatStateModel = {
    id: number,
    title: string,
    token: string,
    avatar: string,
    users: ChatUserModel[],
}