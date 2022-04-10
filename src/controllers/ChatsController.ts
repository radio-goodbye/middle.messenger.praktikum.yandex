import { ChatListApi } from '../api/ChatListApi';
import { ChatTokenApi } from '../api/ChatTokenApi';
import { ChatUsersApi } from '../api/ChatUsersApi';
import { UserSearchApi } from '../api/UserSearchApi';
import { ChatStateModel } from '../types/models/ChatStateModel';
import { Controller } from './Controller';

export class ChatsController extends Controller {

  chatList : ChatListApi = new ChatListApi();

  chatTokenApi: ChatTokenApi = new ChatTokenApi();

  chatUsersApi: ChatUsersApi = new ChatUsersApi();

  userSearchApi: UserSearchApi = new UserSearchApi();

  getChats() {
    this.chatList.request().then((data) => {
      this.store.set('chats', data, 'chats:update');
    });
  }
    
  createChat(name: string) {
    this.chatList.create({ name }).then(() => {
      this.getChats();
    });
  }

  selectChat(id: number) {

    this.chatList.request().then(data => {
      let chat = data.find(ch => ch.id === id);
      if (chat) {
        let chatState = { id, title: chat.title, avatar: chat.avatar } as ChatStateModel;

        this.chatTokenApi.request({ id })
          .then(result => {
            chatState.token = result.token;
            return this.chatUsersApi.request({ id });
          })
          .then(result => {
            chatState.users = result;
            this.store.set('current_chat', chatState, 'chats:selected');
          });
      } else {
        alert(`Чат с id=${id} не найден`);
      }
    });

        
  }

  addUserToCurrentChat(login: string, chat_id: number) {
    this.userSearchApi.request({ login: login })
      .then((users) => {
        let user = users.find(u => u.login === login);
        if (user) {
          this.chatUsersApi.create({ id: chat_id, userId: user.id })
            .then(() => {
              this.selectChat(chat_id);
            });
        } else {
          alert(`Пользователь с логином ${login} не найден`);
        }
      });
  }
}