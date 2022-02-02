import { Component } from '../common/Component';
import { EventBus } from '../common/EventBus';

const inputTemplate = `
        <div class="field-block">
            <div class="field-title"><label for="{{name}}">{{title}}</label></div>
            <input class="field-input-text" type="{{type}}" name="{{name}}" value="{{value}}"
                placeholder="{{placeholder}}" c-on-focus="onFocus" c-on-blur="onBlur" />
        </div>
`;

/** Компонент текстового инпута для ввода */
export class TextInput extends Component {
  constructor(data: object, template?: string, config?: { eventBus?: EventBus }) {
    super(template ?? inputTemplate, data, config);
  }

  protected _render() {
    let inputData = '';
    let inFocus = false;
    var inputs;
    if (this.element) {
      inputs = this.element.getElementsByTagName('input');
      if (inputs.length > 0) {
        inputData = inputs[0].value;
        if (document.activeElement == inputs[0]) {
          inFocus = true;
        }
      }
    }
    super._render();
    if (this.element) {
      inputs = this.element.getElementsByTagName('input');
      if (inputs.length > 0) {
        inputs[0].value = inputData;
        if (inFocus) {
          inputs[0].focus();
        }
      }
    }
  }
}
