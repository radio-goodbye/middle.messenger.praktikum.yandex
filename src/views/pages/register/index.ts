import { Component } from '../../../components/common/Component';
import { Button } from '../../../components/forms/Button';
import { TextInput } from '../../../components/forms/TextInput';
import { FormValidator } from '../../../utils/FormValidator';

const registerPageTemplate = `
<div>
<h1>Регистрация</h1>
<form action="/chat" c-on-submit="onSubmit">
    <div class="field-row">
        {{email_input}}
    </div>
    <div class="field-row">
        {{login_input}}
    </div>
    <div class="field-row">
        {{password_input}}
    </div>
    <div class="field-row">
        {{fisrtname_input}}
        {{lastname_input}}
    </div>
    <div class="field-row">
        {{phone_input}}
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

const validator = new FormValidator(['login', 'password', 'email', 'first_name', 'second_name', 'phone']);

const page = new Component(
  registerPageTemplate,
  {
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
    password_input: new TextInput({
      name: 'password',
      type: 'password',
      title: 'Пароль',
      value: '',
      placeholder: '**********',
      onFocus: (e: Event) => validator.submit('password', e),
      onBlur: (e: Event) => validator.submit('password', e),
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
    lastname_input: new TextInput({
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
    button: new Button({
      text: 'Зарегистрироваться',
    }),
    onSubmit(e: Event) {
      const result = validator.checkData();
      console.log(result);
      if (result) return true;

      e.preventDefault();
      return false;
    },
  },
);

validator.onValid = function () {
  page.props.error = null;
};

validator.onValidError = function (error: string) {
  page.props.error = error;
};

page.bindToElement(document.getElementById('form__inner')!);
