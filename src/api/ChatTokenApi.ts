import { ChatTokenModel } from '../types/models/ChatTokenModel';
import { BaseApi } from './BaseApi';

export class ChatTokenApi extends BaseApi{
  request(data: { id: number }) {
    return this.instance.post<ChatTokenModel>('chats/token/' + data.id);
  }
}