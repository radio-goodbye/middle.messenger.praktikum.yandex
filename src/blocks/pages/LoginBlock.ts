import { Button } from "../../components/forms/Button";
import { TextInput } from "../../components/forms/TextInput";
import { Dictionary } from "../../types/Dictionary";
import { FormValidator } from "../../utils/FormValidator";
import { BlockConfig } from "../common/Block";
import { FormBlock } from "../common/FormBlock";


const loginPageTemplate = `
<div id="service_center_block">
  <div>
  <h1>{{header}}</h1>
  <form action="/login" c-on-submit="onSubmit">
      <div class="field-row">
          {{login_input}}
      </div>
      <div class="field-row">
          {{password_input}}
      </div>
      <div class="buttons-row">
          {{button}}
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
  </form>
  <div class="buttons-row">
      <div class="button-block">
          <a class="helper-button" href="/register">Нет профиля?</a>
      </div>
  </div>
  </div>
</div>
`;

export class LoginBlock extends FormBlock {
  public template: string = loginPageTemplate;

  componentConfig: Dictionary =
    {
      header: 'Вход',
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
      button: new Button({
        text: 'Войти',
      }),
      onSubmit: (e: Event) => {
        e.preventDefault();
        const result = this.validator.checkData();
        if (result) {
          if (this.component) this.component.props.validator_error = null;
          var fd = new FormData(e.target as HTMLFormElement);
          let login = fd.get("login") as string;
          let password = fd.get("password") as string;
          this.state.controllers.authorization.login({ login, password })

          return true;
        };


        return false;
      },
    }

  public validator: FormValidator = new FormValidator(['login', 'password']);

  emitters = {
    'check:complete': () => {
      this.state.router.go("/chat");
    },
    'login:complete': () => {
      this.state.router.go("/chat");
    },
    'login:error': (data: any) => {
      if (this.component) this.component.props.error = this.state.store.getState().error?.text;
    }
  }

  beforeShow(): void {
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