import { v4 } from "uuid";
import { Dictionary } from "../../types/Dictionary";
import { Component } from "./Component";
import { EventBus } from "./EventBus";

export class ComponentsList extends Component {
    constructor(childs?: Component[], config?: { eventBus?: EventBus }) {
        let props: Dictionary = {};
        if (childs) {
            childs.forEach(ch => {
                let guid = v4();
                props[guid] = ch;
            });
        }
        super('', props, config);
    }

    /** Шаблон */
    get template(): string {
        var tmp = '<div>';
        if (this.childs){
            Object.keys(this.childs).forEach(guid => {
                tmp += `<div data-block-id='${guid}'></div>`
            })
        }
        tmp += '</div>';
        return tmp;
    }

    set template(val: string) {
        
    }

    private _updateTemplate() {
        this.afterInit();
        if (this._addOrRemoveTimeout) clearTimeout(this._addOrRemoveTimeout);
        this._addOrRemoveTimeout = setTimeout(() => {
            this.redraw();
        }, 50);
    }

    private _addOrRemoveTimeout: NodeJS.Timeout;

    add(component: Component) {
        if (Object.values(this.childs).map(c => c.component).indexOf(component) == -1) {
            let guid = v4();
            this.childs[guid] = { name: (Object.keys(this.childs).length + 1).toString(), component: component };
            this._updateTemplate();
        }
    }

    remove(component: Component) {
        if (Object.values(this.childs).map(c => c.component).indexOf(component) != -1) {
            let guid = Object.keys(this.childs).filter(key => this.childs[key].component == component)?.[0];
            if (guid) {
                component.destruct();
                delete this.childs[guid];
            }
        }
    }

    removeAll(){
        Object.values(this.childs).forEach(child => {
            this.remove(child.component);
        })
    }
}