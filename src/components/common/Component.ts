import { v4 } from 'uuid';
import { EventBus } from './EventBus';
import { get } from '../../utils/get';
import { Templator } from '../../utils/Templator';
import { ComponentEventTypes } from './ComponentEvents';

/** События компонента */
export enum ComponentEvents {
  /** Инициализация */
  INIT = 'init',
  /** Создание */
  FLOW_CDM = 'flow:component-did-mount',
  /** Обновление */
  FLOW_CDU = 'flow:component-did-update',
  /** Рендер */
  FLOW_RENDER = 'flow:render',
  /** Включение обработчиков событий */
  FLOW_EE = 'flow:events-enable',
  /** Выключение обработчиков событий */
  FLOW_ED = 'flow:events-disable',
}

/** Компонент */
export class Component {
  /** Шаблон */
  template: string = null;

  /** Автобус с событиями */
  private _eventBus: EventBus = null;

  /** Дочерние элементы-компоненты */
  childs: { [id: string]: { name: string, component: Component } } = {};

  /** События, привязанные к компоненту */
  events: Map<HTMLElement, {
    event: keyof GlobalEventHandlersEventMap,
    func: EventListener
  }[]> = new Map<HTMLElement, {
      event: keyof GlobalEventHandlersEventMap,
      func: EventListener
    }[]>();

  /** Собственные проперти */
  props: object = {};

  /** HTML-элемент компонента */
  private _element: HTMLElement = null;

  constructor(template: string, data: object, config?: { eventBus?: EventBus }) {
    this.template = template;
    this._eventBus = config?.eventBus ?? new EventBus();

    const props = {};

    if (data) {
      for (const i in data) {
        if (data[i] instanceof Component) {
          const guid = v4();
          this.childs[guid] = { name: i, component: data[i] };
        } else {
          props[i] = data[i];
        }
      }
    }

    if (Object.keys(this.childs).length != 0) {
      Object.keys(this.childs).forEach((guid) => {
        this.template = this.template.replace(new RegExp(`{{\\s*${this.childs[guid].name}\\s*}}`), `<div data-block-id='${guid}'></div>`);
      });
    }

    this._makePropsProxy(props);

    this._registerEvents(this._eventBus);
    this._eventBus.emit(ComponentEvents.INIT);
  }

  /** Родитель компонента */
  _parentElement: Element = null;

  /**
     * Забиндить компонент к родителю
     * @param element Элемент родителя
     */
  bindToElement(element: Element): void {
    if (element) {
      this._parentElement = element;
    }
    this._render();
  }

  /**
     * Регистрация событий
     * @param eventBus Автобус для событий
     */
  _registerEvents(eventBus): void {
    eventBus.on(ComponentEvents.INIT, this.init.bind(this));
    eventBus.on(ComponentEvents.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(ComponentEvents.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(ComponentEvents.FLOW_RENDER, this._render.bind(this));
    eventBus.on(ComponentEvents.FLOW_CDU, this._render.bind(this));
    eventBus.on(ComponentEvents.FLOW_EE, this._enableEvents.bind(this));
    eventBus.on(ComponentEvents.FLOW_ED, this._disableEvents.bind(this));
  }

  /** Создать элемент */
  _createResources(): void {
    this._element = this._createDocumentElement('template');
  }

  /** Инициализация компонента */
  init(): void {
    this._createResources();
    this._eventBus.emit(ComponentEvents.FLOW_RENDER);
  }

  /** Триггер: компонент появился на странице */
  private _componentDidMount(): void {
    this.componentDidMount();
  }

  /**
     * Функция при появлении компонента на странице
     * @param oldProps
     */
  componentDidMount(): void { 
  }

  /** Триггер: компонент был обновлен */
  _componentDidUpdate(): void {
  }

  /**
     * Функция при обновлении компонента
     * @param oldProps Старый набор параметров
     * @param newProps Новый набор параметров
     * @returns
     */
  componentDidUpdate(): boolean {
    return true;
  }

  /** Текущий HTML-элемент */
  get element(): HTMLElement {
    return this._element;
  }

  /** Перерисовать элемент */
  protected _render(): void {
    this.disableEvents();
    const template: HTMLElement = this._createDocumentElement('div');
    template.innerHTML = this.render();
    this._element = template.children[0] as HTMLElement;

    this.enableEvents();

    if (Object.keys(this.childs).length > 0) {
      Object.keys(this.childs).forEach((guid) => {
        const elements = this.element.querySelectorAll(`[data-block-id='${guid}']`);
        if (elements.length > 0) {
          this.childs[guid].component._render();
          elements[0].replaceWith(this.childs[guid].component.element);
        }
      });
    }

    if (this._parentElement) {
      this._parentElement.innerHTML = '';
      if (this.element) {
        this._parentElement.appendChild(this.element);
      }
    }
  }

  /** Получить строку для рендера компонента */
  render(): string {
    const templator = new Templator(this.template);
    return templator.compile(this.props);
  }

  /** Функция при включении событий-обработчиков */
  enableEvents(): void {
    this._eventBus.emit(ComponentEvents.FLOW_EE);
  }

  /** Триггер: были включены события-обработчики */
  private _enableEvents(): void {
    if (this.element) {
      ComponentEventTypes.forEach((ev) => {
        const elements = this.element.querySelectorAll(`[c-on-${ev}]`);
        if (elements.length > 0) {
          elements.forEach((el) => {
            const element = el as HTMLElement;
            const attr = element.getAttribute(`c-on-${ev}`);
            if (attr.trim()) {
              const event = get(this.props, attr.trim());
              if (event) {
                if (!this.events.has(element)) {
                  this.events.set(element, []);
                }
                this.events.get(element).push({
                  event: ev,
                  func: event as EventListener,
                });
              }
            }
          });
        }
      });
    }

    if (Array.from(this.events.keys()).length > 0) {
      const elements = Array.from(this.events.keys());
      elements.forEach((el) => {
        if (this.events.has(el)) {
          const events = this.events.get(el);
          events.forEach((ev) => {
            el.addEventListener(ev.event, ev.func.bind(this));
          });
        }
      });
    }
  }

  /** Функция при выключении обработчиков */
  disableEvents(): void {
    this._eventBus.emit(ComponentEvents.FLOW_ED);
  }

  /** Триггер: события-обработчики были выключены */
  private _disableEvents(): void {
    if (Object.keys(this.childs).length > 0) {
      Object.keys(this.childs).forEach((guid) => {
        this.childs[guid].component.disableEvents();
      });
    }

    if (this.events.keys.length > 0) {
      const elements = Array.from(this.events.keys());
      elements.forEach((el) => {
        if (this.events.has(el)) {
          const events = this.events.get(el);
          events.forEach((ev) => {
            el.removeEventListener(ev.event, ev.func);
          });
        }
        this.events.delete(el);
      });
    }
  }

  /** Получить текущий элемент */
  getContent(): HTMLElement {
    return this.element;
  }

  /**
     * Сделать из объекта пропсы на проксях
     * @param props Объект
     */
  private _makePropsProxy(props): void {
    const self = this;

    this.props = new Proxy(props, {
      get(obj, prop) {
        return obj[prop];
      },
      set(obj, prop, val) {
        const oldVal = obj[prop];
        obj[prop] = val;
        if (obj[prop] != oldVal) self._eventBus.emit(ComponentEvents.FLOW_CDU);
        return true;
      },
      deleteProperty(obj, prop) {
        delete obj[prop];
        return true;
      },
    });
  }

  /** Создать элемент в документе страницы */
  private _createDocumentElement(tagName): HTMLElement {
    return document.createElement(tagName);
  }
}
