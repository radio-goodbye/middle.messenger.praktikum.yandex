import { FormController } from './FormController';

export class ErrorController extends FormController {
  constructor() {
    super();
    this.viewBug.title = 'Мессенджер: Ошибка';
  }

  private _loginLayoutPath = `${process.cwd()}/src/views/pages/error/template.html`;

  renderLayout(): string {
    this.viewBug.title = `Мессенджер: Ошибка ${404}`;
    this.viewBug.service_center_block = this.compileHTML(this._loginLayoutPath, {
      code: 404,
      header: 'Ошибка',
      description: 'Мы не знаем как Вы сюда попали, но уже делаем все, чтобы Вы никогда не попали сюда снова',
    });
    return super.renderLayout();
  }
}
