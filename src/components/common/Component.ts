import { v4 } from 'uuid';
import { EventBus } from './EventBus';
import { get } from '../../utils/get';
import { Templator } from '../../utils/Templator';
import { ComponentEventTypes } from './ComponentEvents';
import { Dictionary } from '../../types/Dictionary';

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

/** Вложенный компонент */
type ComponentChild = {
  /** Ключ (гуид) */
  [id: string]:
  {
    /** Название компонента */
    name: string,
    /** Сам компонент */
    component: Component
  }
};

/** События в компоненте */
class ComponentEventsMap extends Map<HTMLElement, {
  /** Название события */
  event: keyof GlobalEventHandlersEventMap,
  /** Функция */
  func: EventListener
}[]>{
  constructor(){
    super();
  }
}

export type ComponentEvent = (e: Event | string, component: Component) => void

/** Компонент */
export class Component {
  protected _template: string;

  /** Шаблон */
  get template(): string {
    return this._template;
  }

  set template(val: string) {
    this._template = val;
  }

  /** Автобус с событиями */
  private _eventBus?: EventBus;

  /** Автобус с событиями */
  get eventBus(): EventBus {
    return this._eventBus!;
  }

  set eventBus(val: EventBus) {
    this._eventBus = val;
  }

  /** Дочерние элементы-компоненты */
  private _childs?: ComponentChild = {};

  get childs(): ComponentChild {
    return this._childs!;
  }

  set childs(val: ComponentChild) {
    this._childs = val;
  }

  /** События, привязанные к компоненту */
  private _events?: ComponentEventsMap;

  /** События, привязанные к компоненту */
  get events(): ComponentEventsMap {
    return this._events!;
  }

  set events(val: ComponentEventsMap) {
    this._events = val;
  }

  /** Собственные проперти */
  private _props?: Dictionary = {};

  /** Собственные проперти */
  get props(): Dictionary {
    return this._props!;
  }

  set props(val: Dictionary) {
    this._props = val;
  }

  /** HTML-элемент компонента */
  private _element?: HTMLElement;

  /** HTML-элемент компонента */
  get element(): HTMLElement {
    return this._element!;
  }

  set element(val: HTMLElement) {
    this._element = val;
  }

  private _data: Dictionary;

  constructor(template: string, data: Dictionary, config?: { eventBus?: EventBus }) {
    this.template = template;
    this.eventBus = config?.eventBus ?? new EventBus();

    this._data = data;

    this._registerEvents(this.eventBus);
    if (this.eventBus) this.eventBus.emit(ComponentEvents.INIT);
  }

  /** Родитель компонента */
  private _parentElement?: Element;

  /** Родитель компонента */
  get parentElement(): Element {
    return this._parentElement!;
  }

  set parentElement(val: Element) {
    this._parentElement = val;
  }

  /**
     * Забиндить компонент к родителю
     * @param element Элемент родителя
     */
  bindToElement(element: Element): void {
    if (element) {
      this.parentElement = element;
    }
    this._render();
  }

  /**
     * Регистрация событий
     * @param eventBus Автобус для событий
     */
  _registerEvents(eventBus: EventBus): void {
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
    this.element = this._createDocumentElement('template');
  }

  /** Инициализация компонента */
  init(): void {
    const props = {} as Dictionary;
    let data = this._data;
    this.events = new ComponentEventsMap();
    this.childs = {};
    if (data) {
      for (const i in data) {
        if (data[i] instanceof Component) {
          const guid = v4();
          this.childs[guid] = { name: i, component: data[i] };
          data[i].init();
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

    this._createResources();

    this.afterInit();

    if (this.eventBus) this.eventBus.emit(ComponentEvents.FLOW_RENDER);

  }

  afterInit() {

  }

  /** Уничтожить компонент */
  destruct(): void {
    if (this.childs)
      if (Object.keys(this.childs).length > 0) {
        for (var i in this.childs) {
          this.childs[i].component.destruct();
        }
      }
    delete this._childs;
    delete this._parentElement;
    delete this._element;
    delete this._props;
    delete this._events;
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

  /** Функция перед началом рендера */
  beforeRender(): void {

  }

  redraw() {
    if (this.eventBus) this.eventBus.emit(ComponentEvents.FLOW_RENDER);
  }

  /** Перерисовать элемент */
  private _render(): void {
    this.beforeRender();
    this.disableEvents();
    const template: HTMLElement = this._createDocumentElement('div');
    template.innerHTML = this.render();
    let el = template.children[0] as HTMLElement;
    if (this.element.parentNode) {
      this.element.parentNode.replaceChild(el, this.element);
    }
    this.element = el;

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

    if (this.parentElement) {
      this.parentElement.innerHTML = '';
      if (this.element) {
        this.parentElement.appendChild(this.element);
      }
    }

    this.afterRender();
  }

  /** Функция после окончания рендера */
  afterRender(): void {

  }

  /** Получить строку для рендера компонента */
  render(): string {
    const templator = new Templator(this.template);
    return templator.compile(this.props);
  }

  /** Функция при включении событий-обработчиков */
  enableEvents(): void {
    if (this.eventBus) this.eventBus.emit(ComponentEvents.FLOW_EE);
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
            if (attr?.trim()) {
              const event = get(this.props, attr.trim());
              if (event) {
                if (!this.events.has(element)) {
                  this.events.set(element, []);
                }
                var elem = this.events.get(element);
                if (elem) {
                  elem.push({
                    event: ev,
                    //@ts-ignore
                    func: (ev) => (event as EventListener)(ev, this),
                  });
                }

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
          if (events) {
            events.forEach((ev) => {
              el.addEventListener(ev.event, ev.func);
            });
          }
        }
      });
    }
  }

  /** Функция при выключении обработчиков */
  disableEvents(): void {
    if (this.eventBus) this.eventBus.emit(ComponentEvents.FLOW_ED);
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
          if (events) {
            events.forEach((ev) => {
              el.removeEventListener(ev.event, ev.func);
            });
          }

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
  private _makePropsProxy(props: Dictionary): void {

    this.props = new Proxy(props, {
      get: (obj, prop) => {
        return obj[prop];
      },
      set: (obj, prop, val) => {
        let oldVal = obj[prop], newVal = val;
        obj[prop] = val;
        if (newVal !== oldVal && this.eventBus) this.eventBus.emit(ComponentEvents.FLOW_CDU);
        return true;
      },
      deleteProperty: (obj, prop) => {
        delete obj[prop];
        return true;
      },
    });
  }

  /** Создать элемент в документе страницы */
  private _createDocumentElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }
}
