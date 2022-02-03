import * as fs from 'fs';
import { Templator } from '../utils/Templator';
import { Dictionary } from '../types/Dictionary';

/**  Базовый контроллер */
export class BaseController {
  /** Список значний для рендера страницы на стороне сервера */
  viewBug: Dictionary = {};

  constructor() {
    this.viewBug.title = 'Мессенджер: Пустой слой (переопредели меня)';
    this.viewBug.layout_inner_data = null;
  }

  private _baseLayoutPath = `${process.cwd()}/src/views/layouts/base/template.html`;

  /** Отрендерить слой-шаблон */
  renderLayout(): string {
    return this.compileHTML(this._baseLayoutPath, this.viewBug);
  }

  /**
    * Достать содержимое из файла
    * @param filepath Путь к файлу
    * @returns
    */
  protected extractHTML(filepath: string): string {
    try {
      const path = filepath.replace(`${process.cwd()}/src`, `${process.cwd()}/dist`);
      const text = fs.readFileSync(path, 'utf8');
      return text;
    } catch (err) {
      return `<div style="color: red">${err.stack}</div>`;
    }
  }

  /**
     *  Скомпилировать документ-шаблон HTML с помощью объекта
     * @param filepath Путь к файлу HTML
     * @param context Объект для шаблонизации
     * @returns
     */
  protected compileHTML(filepath: string, context: Dictionary): string {
    const template = this.extractHTML(filepath);
    const templator = new Templator(template);
    return templator.compile(context);
  }
}
