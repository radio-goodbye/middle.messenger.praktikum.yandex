import { Component } from '../../../components/common/Component';
import { Button } from '../../../components/forms/Button';
import { TextInput } from '../../../components/forms/TextInput';
import { FormValidator } from '../../../utils/FormValidator';

const loginPageTemplate = `
<div>
<h1>{{header}}</h1>
<form action="/chat" c-on-submit="onSubmit">
    <div class="field-row">
        {{login_input}}
    </div>
    <div class="field-row">
        {{password_input}}
    </div>
    <div class="buttons-row">
        {{button}}
    </div>
    <div class="field-row error-row">
    [if {{error}}]
        <h6 class="danger-info">{{error}}</h6>
    [endif {{error}}]
    </div>
</form>
<div class="buttons-row">
    <div class="button-block">
        <a class="helper-button" href="/register">Нет профиля?</a>
    </div>
</div>
</div>
`;

const validator = new FormValidator(['login', 'password']);

const page = new Component(
  loginPageTemplate,
  {
    header: 'Вход',
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
    button: new Button({
      text: 'Войти',
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
