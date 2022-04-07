import { Component, ComponentEvent } from '../common/Component';
import { EventBus } from '../common/EventBus';

/** Данные для компонента текстового импута */
export type TextInputData = {
  /** Название поля */
  name?: string,
  /**  Тип (text, number, password etc.) */
  type?: string,
  /** Лейбл поля */
  title?: string,
  /** Значение по умолчанию */
  value?: string,
  /** Плейсхолдер */
  placeholder?: string,
  /** Функция при апдейте */
  update?: ComponentEvent,
  /** Функция при фокусировке на инпуте  */
  onFocus?:ComponentEvent,
  /** Функция при вывода инпута из текущего фокуса */
  onBlur?: ComponentEvent,
};

const inputTemplate = `
<div class="field-block">
  <div class="field-title"><label for="{{name}}">{{title}}</label></div>
  <input class="field-input-text" 
    type="{{type}}" 
    name="{{name}}" 
    value="{{value}}"
    placeholder="{{placeholder}}" 
    c-on-focus="onFocus" 
    c-on-blur="onBlur" />
</div>
`;

/** Компонент текстового инпута для ввода */
export class TextInput extends Component {
  constructor(data: TextInputData, template?: string, config?: { eventBus?: EventBus }) {
    super(template ?? inputTemplate, data, config);
  }

  /** Список инпутов на форме */
  inputs: HTMLCollectionOf<HTMLInputElement> | null;

  /** Введенные данные с формы */
  inputData: string;

  /** Флаг: инпут находится в фокусе */
  inFocus: boolean;

  beforeRender() {
    this.inputData = '';
    this.inFocus = false;
    this.inputs = null;
    if (this.element) {
      this.inputs = this.element.getElementsByTagName('input');
      if (this.inputs.length > 0) {
        this.inputData = this.inputs[0].value;
        if (document.activeElement == this.inputs[0]) {
          this.inFocus = true;
        }
      }
    }
  }

  afterRender(): void {
    if (this.element) {
      this.inputs = this.element.getElementsByTagName('input');
      if (this.inputs.length > 0) {
        this.inputs[0].value = this.inputData || this.props.value;
        if(this.props.update) this.props.update( this.inputs[0].value);
        if (this.inFocus) {
          this.inputs[0].focus();
        }
      }
    }
  }
}
