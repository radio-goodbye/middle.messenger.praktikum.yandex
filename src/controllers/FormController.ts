import { BaseController } from './BaseController';

/** Контроллер страниц с формой */
export class FormController extends BaseController {
  private _formLayoutPath = `${process.cwd()}/src/views/layouts/form/template.html`;

  renderLayout(): string {
    this.viewBug.layout_inner_data = this.compileHTML(this._formLayoutPath, {});
    return super.renderLayout();
  }
}
