import { Dictionary } from "../types/Dictionary";
import { HTTP } from "../utils/HTTP";

export class BaseApi {
    /** Домен сваггера */
    protected _domain: string = "https://ya-praktikum.tech/api/v2";

    private _http_instance: HTTP;

    protected get instance(): HTTP {
        if (!this._http_instance) this._http_instance = new HTTP(`${this._domain}`);
        return this._http_instance;
    }

    create(data: Dictionary): any { throw new Error('Not implemented'); }

    request(data: Dictionary): any { throw new Error('Not implemented'); }

    update(data: Dictionary): any { throw new Error('Not implemented'); }

    delete(data: Dictionary): any { throw new Error('Not implemented'); }
}