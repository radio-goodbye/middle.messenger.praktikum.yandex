import { AppState } from "../app/AppState";
import { Block } from "../blocks/common/Block";
import { AuthorizeController } from "../controllers/AuthorizeController";
import { ChatsController } from "../controllers/ChatsController";
import { UserController } from "../controllers/UserController";
import { Store } from "../store/Store";
import { Route } from "./Route";



export class Router {
    static __instance: Router;
    
    private _rootQuery: string;
    history: History;
    private _currentRoute?: Route;

    routes: Map<string, Route>

    constructor(rootQuery: string) {
        if (Router.__instance) {
            return Router.__instance;
        }

        this.routes = new Map<string, Route>();
        this.history = window.history;
        this._currentRoute = undefined;
        this._rootQuery = rootQuery;

        Router.__instance = this;

        let store = new Store();

        this.state = {
            store,
            controllers: {
                authorization: new AuthorizeController(store),
                user: new UserController(store),
                chats: new ChatsController(store),
            },
            router: this
        }
    }

    state: AppState

    use(pathname: string, block: typeof Block) {
        const route = new Route(pathname, block, {rootQuery: this._rootQuery, state: this.state});
        this.routes.set(pathname, route);
        return this;
    }

    start() {
        window.addEventListener('popstate', (evt: any) => {
            this._onRoute(evt.currentTarget.location.pathname);
        });
        this._onRoute(window.location.pathname);
    }

    _onRoute(pathname: string) {
        let route = this.getRoute(pathname);
        
        if (!route) {
            route = this.getRoute(this._errorPath);
        }

        if (this._currentRoute && this._currentRoute !== route) {
            this._currentRoute.leave();
        }

        this._currentRoute = route;
        route!.render();
        
        var el = document.getElementById(this._rootQuery);
        var links = el?.querySelectorAll('a');
        if (links)
        for(var i = 0; i < links.length; i++){
            links[i].addEventListener('click',(e) => {
                e.preventDefault();
                if ((e.srcElement as any).pathname){
                    this.go((e.srcElement as any).pathname as string);
                }
             });
        }
    }

    go(pathname: string) {
        this.history.pushState({}, '', pathname);
        this._onRoute(pathname);
    }

    back() {
        this.history.back();
    }

    forward() {
        this.history.forward();
    }

    getRoute(pathname: string) {
        return this.routes.get(pathname);
    }

    private _errorPath: string = '/error';

    setError(block: typeof Block){
        return this.use(this._errorPath, block);
    }
}