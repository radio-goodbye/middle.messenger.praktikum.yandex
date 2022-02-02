import { Component } from '../common/Component';
import { EventBus } from '../common/EventBus';

const template = `
<div class="button-block">
            <button class="main-button" type="submit" >{{text}}</button>
        </div>
`;
/** Компонент кнопки в форме */
export class Button extends Component {
  constructor(data: object, config?: { eventBus?: EventBus }) {
    super(template, data, config);
  }
}
