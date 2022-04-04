import { Store } from "../store/Store";

export class Controller{
    store: Store;

    constructor(store: Store){
        this.store = store;
    }
}