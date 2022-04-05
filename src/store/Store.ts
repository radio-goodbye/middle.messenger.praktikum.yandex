import { EventBus } from '../components/common/EventBus';
import { Dictionary } from '../types/Dictionary';

export enum StoreEvents {
  Updated = 'updated',
}

export type StoreEmitter = (data?: any) => void;

export class Store extends EventBus {

  constructor(){
    super();
    if (!localStorage.getItem('userStore')){
      localStorage.setItem('userStore', '{}');
            
    }
    this._data = JSON.parse(localStorage.getItem('userStore')!);
  }

  private _data: Dictionary;

  private _updateTimeout: NodeJS.Timeout;

  public set<T>(path: string, value: T, event: string) {
    if (typeof path != 'string') throw new Error('path must be string');
    path.split('.').reduce((obj: any, prop: any, index: any, arr: any) => {
      if (index == arr.length - 1) obj[prop] = value;
      else if (!obj[prop]) obj[prop] = {};
      return obj[prop];
    }, this._data);
    if (this._updateTimeout) clearTimeout(this._updateTimeout);
    this._updateTimeout = setTimeout(() => {
      localStorage.setItem('userStore', JSON.stringify(this._data));
      this.emit(StoreEvents.Updated, event, value);
    }, 100);
  }

  public getState() {
    return this._data;
  }
}