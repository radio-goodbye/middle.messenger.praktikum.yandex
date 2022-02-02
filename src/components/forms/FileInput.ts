import { Component } from '../common/Component';
import { EventBus } from '../common/EventBus';

const template = `
<div class="field-block">
    <div class="field-title"><label for="{{name}}-field" >{{title}}</label></div>
    <label for="{{name}}-field" class="field-input-file-label">Выберите файл...</label>
    <input class="field-input-file" type="file" name="{{name}}" id="{{name}}-field" accept="{{accept}}"
        placeholder="{{placeholder}}"  />
</div>
`;

/** Компонент инпута для файла в форме */
export class FileInput extends Component {
  constructor(data: object, config?: { eventBus?: EventBus }) {
    super(template, data, config);
  }
}
