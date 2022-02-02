/** Автобус с событиями */
export class EventBus {
  /** Список прослушек */
  private _listeners: { [key: string]: Function[] };

  constructor() {
    this._listeners = {};
  }

  /**
     * Привязать прослушку к событию
     * @param event Событие
     * @param callback Функция
     * @param index Порядок вставки
     */
  on(event: string, callback: Function, index = -1): void {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    if (index === -1) this._listeners[event].push(callback);
    else this._listeners[event].splice(index, 0, callback);
  }

  /**
     *  Отвязать прослушку от события
     * @param event Событие
     * @param callback Функция
     */
  off(event: string, callback: Function): void {
    if (!this._listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }

    this._listeners[event] = this._listeners[event].filter(
      (listener) => listener !== callback,
    );
  }

  /**
     * Отсигналить прослушке
     * @param event Событие
     * @param args Аргументы для функции
     */
  emit(event: string, ...args): void {
    if (!this._listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }

    this._listeners[event].forEach((listener) => {
      listener(...args);
    });
  }
}
