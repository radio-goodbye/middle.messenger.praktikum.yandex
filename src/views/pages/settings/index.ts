import { Component } from '../../../components/common/Component';
import { Button } from '../../../components/forms/Button';
import { FileInput } from '../../../components/forms/FileInput';
import { TextInput } from '../../../components/forms/TextInput';
import { FormValidator } from '../../../utils/FormValidator';

const settingsPageTemplate = `
<div>
<h1>Настройки</h1>
<form action="/settings" c-on-submit="onSubmit">
    <div class="field-row">
        {{email_input}}
        <div class="field-block">
        <img src="/user_avatar.png" />
        </div>
    </div>
    <div class="field-row">
        {{login_input}}
        {{avatar_input}}
    </div>
    <div class="field-row">
        {{oldpassword_input}}
        {{newpassword_input}}
    </div>
    <div class="field-row">
        {{fisrtname_input}}
        {{secondname_input}}
    </div>
    <div class="field-row">
        {{phone_input}}
        {{displayname_input}}
    </div>
    <div class="field-row error-row">
    [if {{error}}]
        <h6 class="danger-info">{{error}}</h6>
    [endif {{error}}]
    </div>
    <div class="buttons-row">
        {{button}}
    </div>
</form>
</div>
`;

const validator = new FormValidator(['login', 'oldPassword', 'newPassword', 'email', 'first_name', 'second_name', 'phone']);

const page = new Component(settingsPageTemplate, {
  error: null,
  login_input: new TextInput({
    name: 'login',
    type: 'text',
    title: 'Логин',
    value: '',
    placeholder: 'example',
    onFocus: (e: Event) => validator.submit('login', e),
    onBlur: (e: Event) => validator.submit('login', e),
  }),
  oldpassword_input: new TextInput({
    name: 'oldPassword',
    type: 'password',
    title: 'Старый пароль',
    value: '',
    placeholder: '**********',
    onFocus: (e: Event) => validator.submit('oldPassword', e),
    onBlur: (e: Event) => validator.submit('oldPassword', e),
  }),
  newpassword_input: new TextInput({
    name: 'newPassword',
    type: 'password',
    title: 'Новый пароль',
    value: '',
    placeholder: '**********',
    onFocus: (e: Event) => validator.submit('newPassword', e),
    onBlur: (e: Event) => validator.submit('newPassword', e),
  }),
  email_input: new TextInput({
    name: 'email',
    type: 'text',
    title: 'EMail',
    value: '',
    placeholder: 'example@example.com',
    onFocus: (e: Event) => validator.submit('email', e),
    onBlur: (e: Event) => validator.submit('email', e),
  }),
  fisrtname_input: new TextInput({
    name: 'first_name',
    type: 'text',
    title: 'Имя',
    value: '',
    placeholder: 'Иван',
    onFocus: (e: Event) => validator.submit('first_name', e),
    onBlur: (e: Event) => validator.submit('first_name', e),
  }),
  secondname_input: new TextInput({
    name: 'second_name',
    type: 'text',
    title: 'Фамилия',
    value: '',
    placeholder: 'Иванов',
    onFocus: (e: Event) => validator.submit('second_name', e),
    onBlur: (e: Event) => validator.submit('second_name', e),
  }),
  phone_input: new TextInput({
    name: 'phone',
    type: 'text',
    title: 'Телефон',
    value: '',
    placeholder: '+7-800-555-3535',
    onFocus: (e: Event) => validator.submit('phone', e),
    onBlur: (e: Event) => validator.submit('phone', e),
  }),
  displayname_input: new TextInput({
    name: 'display_name',
    type: 'text',
    title: 'Отображаемое имя',
    value: '',
    placeholder: 'Иваныч777',
  }),
  avatar_input: new FileInput({
    name: 'avatar',
    title: 'Аватар',
    accept: 'image/png, image/jpg',
  }),
  button: new Button({
    text: 'Сохранить',
  }),
  onSubmit(e: Event) {
    const result = validator.checkData();
    console.log(result);
    if (result) return true;

    e.preventDefault();
    return false;
  },
});

validator.onValid = function () {
  page.props.error = null;
};

validator.onValidError = function (error: string) {
  page.props.error = error;
};

page.bindToElement(document.getElementById('form__inner')!);
