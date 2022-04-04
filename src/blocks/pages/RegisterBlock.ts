import { Button } from "../../components/forms/Button";
import { TextInput } from "../../components/forms/TextInput";
import { Dictionary } from "../../types/Dictionary";
import { FormValidator } from "../../utils/FormValidator";
import { BlockConfig } from "../common/Block";
import { FormBlock } from "../common/FormBlock";

const registerPageTemplate = `
<div id="service_center_block">
  <div>
  <h1>Регистрация</h1>
  <form action="/register" c-on-submit="onSubmit">
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
      [if {{error}}]
      <div class="field-row error-row">
          <h6 class="danger-info">{{error}}</h6>
       </div>
      [endif {{error}}]
      [if {{validator_error}}]
      <div class="field-row error-row">
        <h6 class="danger-info">{{validator_error}}</h6>
      </div>
      [endif {{validator_error}}]
      <div class="buttons-row">
          {{button}}
      </div>
  </form>
  </div>
</div>
`;

export class RegisterBlock extends FormBlock {
  public template: string = registerPageTemplate;

  componentConfig: Dictionary = {
    error: null,
    validator_error: null,
    login_input: new TextInput({
      name: 'login',
      type: 'text',
      title: 'Логин',
      value: '',
      placeholder: 'example',
      onFocus: (e: Event) => this.validator.submit('login', e),
      onBlur: (e: Event) => this.validator.submit('login', e),
    }),
    password_input: new TextInput({
      name: 'password',
      type: 'password',
      title: 'Пароль',
      value: '',
      placeholder: '**********',
      onFocus: (e: Event) => this.validator.submit('password', e),
      onBlur: (e: Event) => this.validator.submit('password', e),
    }),
    email_input: new TextInput({
      name: 'email',
      type: 'text',
      title: 'EMail',
      value: '',
      placeholder: 'example@example.com',
      onFocus: (e: Event) => this.validator.submit('email', e),
      onBlur: (e: Event) => this.validator.submit('email', e),
    }),
    fisrtname_input: new TextInput({
      name: 'first_name',
      type: 'text',
      title: 'Имя',
      value: '',
      placeholder: 'Иван',
      onFocus: (e: Event) => this.validator.submit('first_name', e),
      onBlur: (e: Event) => this.validator.submit('first_name', e),
    }),
    lastname_input: new TextInput({
      name: 'second_name',
      type: 'text',
      title: 'Фамилия',
      value: '',
      placeholder: 'Иванов',
      onFocus: (e: Event) => this.validator.submit('second_name', e),
      onBlur: (e: Event) => this.validator.submit('second_name', e),
    }),
    phone_input: new TextInput({
      name: 'phone',
      type: 'text',
      title: 'Телефон',
      value: '',
      placeholder: '+7-800-555-3535',
      onFocus: (e: Event) => this.validator.submit('phone', e),
      onBlur: (e: Event) => this.validator.submit('phone', e),
    }),
    button: new Button({
      text: 'Зарегистрироваться',
    }),
    onSubmit: (e: Event) => {
      e.preventDefault();
      const result = this.validator.checkData();
      if (result) {
        if (this.component) this.component.props.error = null;
        var fd = new FormData(e.target as HTMLFormElement);
        let data = {
          login: fd.get("login") as string,
          password: fd.get("password") as string,
          first_name: fd.get("first_name") as string,
          second_name: fd.get("second_name") as string,
          phone: fd.get("phone") as string,
          email: fd.get("email") as string
        };
        console.log(fd);
        console.log(data);
        this.state.controllers.authorization.register(data);
        return true;
      }

      return false;
    },
  };

  public validator: FormValidator = new FormValidator(['login', 'password', 'email', 'first_name', 'second_name', 'phone']);

  emitters = {
    'check:complete': () => {
      this.state.router.go("/chat");
    },
    'register:comlete': () => {
      this.state.router.go("/chats");
    },
    'register:error': () => {
      if (this.component) this.component.props.error = this.state.store.getState().error?.text;
    },
  }

  constructor(config: BlockConfig) {
    super(config);
    this.validator.onValid = () => {
      if (this.component) this.component.props.validator_error = null;
    };

    this.validator.onValidError = (error: string) => {
      if (this.component) this.component.props.validator_error = error;
    };

    this.state.controllers.authorization.check_user();
  }
}