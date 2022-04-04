import { Button } from "../../components/forms/Button";
import { FileInput } from "../../components/forms/FileInput";
import { TextInput } from "../../components/forms/TextInput";
import { StoreEmitter } from "../../store/Store";
import { Dictionary } from "../../types/Dictionary";
import { UserModel } from "../../types/models/UserModel";
import { FormValidator } from "../../utils/FormValidator";
import { BlockConfig } from "../common/Block";
import { FormBlock } from "../common/FormBlock";

const settingsPageTemplate = `
<div id="service_center_block">
  <div>
  <h1>Настройки</h1>
  <form action="/settings" c-on-submit="onSubmit">
      <div class="field-row">
          {{email_input}}
          <div class="field-block">
          <img src="{{avatar}}" />
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


export class SettingsBlock extends FormBlock {

    public template: string = settingsPageTemplate;

    validator: FormValidator = new FormValidator(['login', 'oldPassword', 'newPassword', 'email', 'first_name', 'second_name', 'phone']);

    public componentConfig: Dictionary = {
        error: null,
        validator_error: null,
        avatar: '/user_avatar.png',
        login_input: new TextInput({
            name: 'login',
            type: 'text',
            title: 'Логин',
            value: '',
            placeholder: 'example',
            update: (e: string) =>  this.validator.submit('login', e),
            onFocus: (e: Event) => this.validator.submit('login', e),
            onBlur: (e: Event) => this.validator.submit('login', e),
        }),
        oldpassword_input: new TextInput({
            name: 'oldPassword',
            type: 'password',
            title: 'Старый пароль',
            value: '',
            placeholder: '**********',
            update: (e: string) =>  this.validator.submit('oldPassword', e),
            onFocus: (e: Event) => this.validator.submit('oldPassword', e),
            onBlur: (e: Event) => this.validator.submit('oldPassword', e),
        }),
        newpassword_input: new TextInput({
            name: 'newPassword',
            type: 'password',
            title: 'Новый пароль',
            value: '',
            placeholder: '**********',
            update: (e: string) =>  this.validator.submit('newPassword', e),
            onFocus: (e: Event) => this.validator.submit('newPassword', e),
            onBlur: (e: Event) => this.validator.submit('newPassword', e),
        }),
        email_input: new TextInput({
            name: 'email',
            type: 'text',
            title: 'EMail',
            value: '',
            placeholder: 'example@example.com',
            update: (e: string) =>  this.validator.submit('email', e),
            onFocus: (e: Event) => this.validator.submit('email', e),
            onBlur: (e: Event) => this.validator.submit('email', e),
        }),
        fisrtname_input: new TextInput({
            name: 'first_name',
            type: 'text',
            title: 'Имя',
            value: '',
            placeholder: 'Иван',
            update: (e: string) =>  this.validator.submit('first_name', e),
            onFocus: (e: Event) => this.validator.submit('first_name', e),
            onBlur: (e: Event) => this.validator.submit('first_name', e),
        }),
        secondname_input: new TextInput({
            name: 'second_name',
            type: 'text',
            title: 'Фамилия',
            value: '',
            placeholder: 'Иванов',
            update: (e: string) =>  this.validator.submit('second_name', e),
            onFocus: (e: Event) => this.validator.submit('second_name', e),
            onBlur: (e: Event) => this.validator.submit('second_name', e),
        }),
        phone_input: new TextInput({
            name: 'phone',
            type: 'text',
            title: 'Телефон',
            value: '',
            placeholder: '+7-800-555-3535',
            update: (e: string) =>  this.validator.submit('phone', e),
            onFocus: (e: Event) => this.validator.submit('phone', e),
            onBlur: (e: Event) => this.validator.submit('phone', e),
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
        onSubmit: (e: Event) => {
            e.preventDefault();
            if (this.component) this.component.props.error = null;
            const result = this.validator.checkData();

            if (result) {
                var fd = new FormData(e.target as HTMLFormElement);
                let avatarFd: FormData | undefined = undefined;
                var avatarInput = ((e.target as HTMLFormElement).elements as any)?.["avatar"];
                if (avatarInput?.value){
                    avatarFd = new FormData(e.target as HTMLFormElement);
                }
                this.state.controllers.user.update_user_data({
                    id: this.state.store.getState().user.id,
                    login: fd.get("login") as string,
                    newPassword: fd.get("newPassword") as string,
                    oldPassword: fd.get("oldPassword") as string,
                    first_name: fd.get("first_name") as string,
                    second_name: fd.get("second_name") as string,
                    phone: fd.get("phone") as string,
                    email: fd.get("email") as string,
                    display_name: fd.get("display_name") as string,
                    avatar: avatarFd
                });
                return true;
            }

            return false;
        },
    };

    emitters: { [key: string]: StoreEmitter; } = {
        'check:error': () => {
            this.state.router.go("/");
        },
        'settings_save:error': () => {
            this.state.router.go("/");
        },
        'check:complete': (data: UserModel) => {
            this.componentConfig.login_input.props.value = data.login;
            this.componentConfig.email_input.props.value = data.email;
            this.componentConfig.fisrtname_input.props.value = data.first_name;
            this.componentConfig.secondname_input.props.value = data.second_name;
            this.componentConfig.phone_input.props.value = data.phone;
            this.componentConfig.displayname_input.props.value = data.display_name;
            if (this.component){
                this.component.props.avatar = data.avatar ? `https://ya-praktikum.tech/api/v2/resources/${data.avatar}` : '/user_avatar.png';
                this.component.redraw();
            }
         
        }
    }

    beforeShow(): void {
        this.state.controllers.authorization.check_user();
    }

    constructor(config: BlockConfig) {
        super(config);
        this.validator.onValid = () => {
            if (this.component) this.component.props.validator_error = null;
        };

        this.validator.onValidError = (error: string) => {
            if (this.component) this.component.props.validator_error = error;
        };
    }
}