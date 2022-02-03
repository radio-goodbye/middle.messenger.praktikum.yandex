import { FormController } from './FormController';

/** Контроллер настроек пользователя */
export class SettingsController extends FormController {
  constructor() {
    super();
    this.viewBug.title = 'Мессенджер: Настройки пользователя';
  }

  private _settingsLayoutPath = `${process.cwd()}/src/views/pages/settings/template.html`;

  renderLayout(): string {
    this.viewBug.service_center_block = this.compileHTML(this._settingsLayoutPath, {});
    return super.renderLayout();
  }
}
