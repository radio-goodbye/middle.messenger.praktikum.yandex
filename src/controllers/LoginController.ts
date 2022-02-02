import { FormController } from './FormController';

/** Контроллер логина */
export class LoginController extends FormController {
  constructor() {
    super();
    this.viewBug.title = 'Мессенджер: Логин';
  }

  private _loginLayoutPath = `${process.cwd()}/src/views/pages/login/template.html`;

  renderLayout(): string {
    this.viewBug.service_center_block = this.compileHTML(this._loginLayoutPath, {});
    return super.renderLayout();
  }
}
