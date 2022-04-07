import { AppState } from "../../app/AppState";
import { Component } from "../../components/common/Component";
import { StoreEmitter, StoreEvents } from "../../store/Store";
import { Dictionary } from "../../types/Dictionary";

export type BlockConfig = {
    state?: AppState, rootQuery?: string
}

export class Block {

    constructor(config: BlockConfig) {
        if (config.state) this.state = config.state;
        if (config.rootQuery) this.rootQuery = config.rootQuery;
        this.emit = this._emit.bind(this);
    }

    public rootQuery: string

    public state: AppState

    private _component?: Component;

    get component(): Component | undefined {
        return this._component;
    }

    set component(val: Component | undefined) {
        this._component = val;
    }

    public emitters: { [key: string]: StoreEmitter } = {}

    public componentConfig: Dictionary;

    public template: string;

    beforeShow() {

    }

    _emit(key: string, val: any) {
        if (this.emitters[key]) {
            this.emitters[key](val);
        }
    }

    emit: (key: string, val: any) => {}

    show() {
        this.beforeShow();
        if (!this.component) {
            this.component = new Component(this.template, this.componentConfig);
            var el = document.getElementById(this.rootQuery);
            if (el){
                this.component.bindToElement(el);
                this.state.store.on(StoreEvents.Updated, this.emit);    
            }
        }
    }

    hide() {
        if (this.component)
            this.component.destruct();
        this.component = undefined;
        this.state.store.off(StoreEvents.Updated, this.emit);
    }
}