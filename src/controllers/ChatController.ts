import { BaseController } from './BaseController';

/** Контроллер чата */
export class ChatController extends BaseController {
  constructor() {
    super();
    this.viewBug.title = 'Мессенджер: Чат';
  }

  private _chatLayoutPath = `${process.cwd()}/src/views/pages/chat/template.html`;

  renderLayout(): string {
    this.viewBug.layout_inner_data = this.compileHTML(this._chatLayoutPath, {});
    return super.renderLayout();
  }
}
