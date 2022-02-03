import { Component } from '../../../components/common/Component';
import { TextInput, TextInputData } from '../../../components/forms/TextInput';
import { Dictionary } from '../../../types/Dictionary';
import { FormValidator } from '../../../utils/FormValidator';

/** Тип сообщения */
enum MessageType{
  /** Входящее */
  Inbound = 'input',
  /** Исходящее */
  Outbound = 'output',
}

const messageTemplate = `
<div class="message message_{{type}}">
            <div class="message_box">
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
    text: string
  } & Dictionary) {
    super(messageTemplate, data);
  }
}

const inputBlockTemplate = `
<div class="input_block">
    <input type="text" name="message" c-on-focus="onFocus" c-on-blur="onBlur" />
</div>
`;

class InputSubcomponent extends TextInput {
  constructor(data: TextInputData) {
    super(data, inputBlockTemplate);
  }
}

const contactBoxTemplate = `
<div class="contact_box">
        <div class="contact_avatar"><img src="{{avatar}}" /></div>
        <div class="contact_name"><span>{{name}}</span></div>
        <div class="contact_message"><span>{{text}}</span></div>
</div>
`;

class ContactBoxSubcomponent extends Component {
  constructor(data: {
    avatar: string,
    name: string,
    text: string
  } & Dictionary) {
    super(contactBoxTemplate, data);
  }
}

const chatPageTemplate = `
<div id="chat_page">
    <div id="contacts_area">
        {{contact}}
    </div>
    <div id="contact_info_area">
        <div class="contact_info_box">
            <div class="contact_info_avatar"><img src="{{contact_info.avatar}}" /></div>
            <div class="contact_info_name"><span>{{contact_info.name}}</span></div>
            <div class="contact_info_lastonline"><span>{{contact_info.lastonline}}</span></div>
        </div>
    </div>
    <div id="messages_area">
        {{message_1}}
        {{message_2}}
    </div>
    <div id="input_area">
        <form action="/chat" c-on-submit="onSubmit">
            {{input}}
            <div class="input_button">
                <button type="submit">Отправить</button>
            </div>
        </form>
    </div>
</div>
`;

const validator = new FormValidator(['message']);

const page = new Component(
  chatPageTemplate,
  {
    contact: new ContactBoxSubcomponent({
      avatar: '/user_avatar.png',
      name: 'Иван Петров',
      text: 'Привет!',
    }),
    contact_info: {
      avatar: '/user_avatar.png',
      name: 'Иван Петров',
      lastonline: 'Был в сети: 14:55',
    },
    message_1: new MessageSubcomponent({
      type: MessageType.Outbound,
      time: '07:00',
      text: 'Привет!',
    }),
    message_2: new MessageSubcomponent({
      type: MessageType.Inbound,
      time: '08:00',
      text: 'Привет!',
    }),
    input: new InputSubcomponent({
      onFocus: (e: Event) => validator.submit('message', e),
      onBlur: (e: Event) => validator.submit('message', e),
    }),
    onSubmit(e: Event) {
      const result = validator.checkData();
      if (result) {
        e.preventDefault();
        return true;
      }

      alert('Сообщение не может быть пустым');
      e.preventDefault();
      return false;
    },
  },
);

page.bindToElement(document.getElementById('form__inner')!);
