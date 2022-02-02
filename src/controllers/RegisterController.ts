import { FormController } from './FormController';

/** Контроллер регистрации */
export class RegisterController extends FormController {
  constructor() {
    super();
    this.viewBug.title = 'Мессенджер: Регистрация';
  }

  private _registerLayoutPath = `${process.cwd()}/src/views/pages/register/template.html`;

  renderLayout(): string {
    this.viewBug.service_center_block = this.compileHTML(this._registerLayoutPath, {});
    return super.renderLayout();
  }
}
