import { Component, ComponentEvent } from '../common/Component';
import { EventBus } from '../common/EventBus';

/** Данные для компонента кнопки */
export type ButtonData = {
  /** Текст на кнопке */
  text: string,
  /** Функция при клике */
  onClick?: ComponentEvent
};

const template = `
<div class="button-block">
  <button class="main-button" type="submit" c-on-click="onClick">{{text}}</button>
</div>
`;
/** Компонент кнопки в форме */
export class Button extends Component {
  constructor(data: ButtonData, config?: { eventBus?: EventBus }) {
    super(template, data, config);
  }
}
