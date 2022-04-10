import { Component, ComponentEvent } from "../../components/common/Component";
import { ComponentsList } from "../../components/common/ComponentsList";
import { Button } from "../../components/forms/Button";
import { TextInput, TextInputData } from "../../components/forms/TextInput";
import { StoreEmitter } from "../../store/Store";
import { Dictionary } from "../../types/Dictionary";
import { ChatMessageModel } from "../../types/models/ChatMessageModel";
import { ChatModel } from "../../types/models/ChatModel";
import { ChatStateModel } from "../../types/models/ChatStateModel";
import { FormValidator } from "../../utils/FormValidator";
import { Block, BlockConfig } from "../common/Block";

import '../../styles/pages/chat/styles.scss';


/** Тип сообщения */
enum MessageType {
    /** Входящее */
    Inbound = 'input',
    /** Исходящее */
    Outbound = 'output',
}

const messageTemplate = `
  <div class="message message_{{type}}">
              <div class="message_box">
                  <div class="message_user">{{user}}</div>
                  <div class="message_time">{{time}}</div>
                  <div class="message_text">{{text }}</div>
              </div>
          </div>
  `;

/** Компонент сообщения */
class MessageSubcomponent extends Component {
    constructor(data: {
        type: MessageType,
        time: string,
        text: string,
        user: string
    } & Dictionary) {
        super(messageTemplate, data);
    }
}

const inputBlockTemplate = `
  <div class="input_block">
      <input type="text" name="message" c-on-focus="onFocus" c-on-blur="onBlur" value="{{value}}" />
  </div>
  `;

class InputSubcomponent extends TextInput {
    constructor(data: TextInputData) {
        super(data, inputBlockTemplate);
    }
}

const contactBoxTemplate = `
    <div>
        <div class="contact_box" c-on-click="onClick">
          <div class="contact_avatar"><img src="{{avatar}}" /></div>
          <div class="contact_name"><span>{{name}}</span></div>
          <div class="contact_message"><span>Непрочитано: {{unread_count}}</span></div>
        </div>
    </div>
  `;

class ContactBoxSubcomponent extends Component {
    constructor(data: {
        avatar: string,
        name: string,
        unread_count: number,
        onClick: ComponentEvent
    } & Dictionary) {
        super(contactBoxTemplate, data);
    }
}

const chatPageTemplate = `
  <div id="chat_page">
      <div id="contacts_area">
        <div class="chat_add_box">
            {{add_chat_button}}
        </div>
        {{contacts}}
      </div>
      [if {{current_chat_id}}]
      <div id="contact_info_area">
          <div class="contact_info_box">
              <div class="contact_info_avatar"><img src="{{contact_info.avatar}}" /></div>
              <div class="contact_info_name"><span>{{contact_info.name}}</span></div>
              <div class="contact_info_lastonline"><span>Кол-во участников: {{contact_info.members}}</span></div>
          </div>
          <div class="contact_info_manage">
            {{add_user_to_chat_button}}
          </div>
      </div>
      <div id="messages_area">
            [if {{page_error}}]
            <div class="info-message">
                <span>{{page_error}}</span>
            </div>
            [endif {{page_error}}]
          {{messages}}
      </div>
      <div id="input_area">
          <form action="/chat" c-on-submit="onSubmit">
              {{input}}
              <span class="input_button">
                  <button type="submit">Отправить</button>
              </span>
          </form>
      </div>
      [endif {{current_chat_id}}]
      <div id="footer_area">
            {{settings_button}}
            {{logout_button}}
      </div>
      
  </div>
  `;

const validator = new FormValidator(['message']);


export class ChatBlock extends Block {
    constructor(config: BlockConfig) {
        super(config);
        setTimeout(() => {
            this.state.controllers.chats.getChats();
        }, 100);
    }

    public template: string = chatPageTemplate

    private _chatsList = new ComponentsList();

    private _messages = new ComponentsList([
    ]);

    private _webSocket: WebSocket;
    private _webSocketPingInterval : NodeJS.Timer;

    public componentConfig: Dictionary =
        {
            add_chat_button: new Button({
                text: 'Создать чат',
                onClick: () => {
                    let chat_name = window.prompt("Введите название чата");
                    if (chat_name) this.state.controllers.chats.createChat(chat_name);
                }
            }),
            contacts: this._chatsList,
            contact_info: {
            },
            page_error: null,
            messages: this._messages,
            input: new InputSubcomponent({
                value: '',
                onFocus: (e: Event) => validator.submit('message', e),
                onBlur: (e: Event) => validator.submit('message', e),
            }),
            onSubmit: (e: Event) => {
                const result = validator.checkData();
                if (result) {
                    e.preventDefault();

                    let fd = new FormData(e.target as HTMLFormElement);
                    let text = fd.get("message") as string;
                    this._webSocket.send(JSON.stringify({
                        content: text.replaceAll(/\<\/?script\>/gm, ''),
                        type: 'message',
                    }));
                    fd.set("message", '');
                    return true;
                }

                alert('Сообщение не может быть пустым');
                e.preventDefault();
                return false;
            },
            current_chat_id: null,
            add_user_to_chat_button: new Button({
                text: '+',
                onClick: () => {
                    let user = window.prompt("Введите username пользователя");
                    if (user?.trim()) {
                        if (this.component)
                            this.state.controllers.chats.addUserToCurrentChat(
                                user, this.component.props.current_chat_id,
                            );
                    }
                }
            }),
            settings_button: new Button({
                text: '⚙️ Настройки',
                onClick: () => {
                    this.state.router.go('/settings');
                }
            }),
            logout_button: new Button({
                text: '💤 Выход',
                onClick: () => {
                    this.state.controllers.authorization.logout();
                }
            }),
        }

    emitters: { [key: string]: StoreEmitter; } = {
        'logout:complete': () => {
            this.state.router.go("/");
        },
        'chats:update': (data: ChatModel[]) => {
            if (data.length) {
                data.forEach(d => {
                    this._chatsList.add( new ContactBoxSubcomponent({
                        avatar: d.avatar ?? '/user_avatar.png',
                        name: d.title,
                        unread_count: d.unread_count ?? 0,
                        id: d.id,
                        onClick: (e: Event, component: Component) => {
                            this.state.controllers.chats.selectChat(component.props.id);
                        }
                    }))
                })
            }
        },
        'chats:selected': (data: ChatStateModel) => {
            console.log(data);
            
            let userId = this.state.store.getState().user.id;
            if (this.component) {
                this.component.props.current_chat_id = data.id;
                this.component.props.contact_info = {
                    name: data.title,
                    members: `${data.users.length} (${data.users.map(u => u.login).join(', ')})`,
                    avatar: data.avatar ?? '/user_avatar.png',
                }
            }
            if (this._webSocket) this._webSocket.close();
            if (this._webSocketPingInterval) clearInterval(this._webSocketPingInterval);
            this._messages.removeAll();
            if (data.users.length < 2){
                if (this.component) this.component.props.page_error = "Добавьте минимум одного пользователя чтобы обмениваться сообщениями";
            }
            else{
                if (this.component){
                    this.component.props.page_error = null;
                }
                this._webSocket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${userId}/${data.id}/${data.token}`);

                this._webSocket.addEventListener('open', () => {
                    console.log('Соединение установлено');
                  
                    this._webSocket.send(JSON.stringify({
                        content: "0",
                        type: "get old"
                    }));
                });

                this._webSocketPingInterval = setInterval(() => {
                    this._webSocket.send(JSON.stringify({
                        type: "ping"
                    }));
                }, 10000);

                  this._webSocket.addEventListener('close', event => {
                    if (event.wasClean) {
                      console.log('Соединение закрыто чисто');
                    } else {
                      console.log('Обрыв соединения');
                    }
                  
                    console.log(`Код: ${event.code} | Причина: ${event.reason}`);
                  });
                  
                this._webSocket.addEventListener('message', event => {
                    let json_data = JSON.parse(event.data);
                    let messages = [] as ChatMessageModel[];
                    if (!Array.isArray(json_data)) {
                        if (json_data.type != 'message') return;
                        messages.push(json_data);
                    }
                    else messages = json_data;
                    messages.reverse().forEach(message => {
                        this._messages.add(new MessageSubcomponent({
                            type: message.user_id === userId ? MessageType.Outbound : MessageType.Inbound,
                            time: message.time,
                            text: message.content,
                            user: data.users.find(u => u.id === message.user_id)?.display_name ?? 'Имя не указано'
                        }))
                    })
                });
                  

                  this._webSocket.addEventListener('error', (event: any) => {
                    console.log('Ошибка', event.message);
                  }); 
            }
        }
    }
}