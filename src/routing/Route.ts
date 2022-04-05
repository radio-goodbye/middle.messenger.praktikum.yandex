import { AppState } from '../app/AppState';
import { Block } from '../blocks/common/Block';
import { isEqual } from '../utils/helpers';

export type RouteConfig = {
  rootQuery: string,
  state: AppState
};

export class Route{
  constructor(pathname: string, view: typeof Block, props: RouteConfig) {
    this.pathname = pathname;
    this._blockClass = view;
    this.props = props;
  }

  private _pathname: string;

  get pathname(): string{
    return this._pathname;
  }

  set pathname(val: string){
    this._pathname = val;
  }

  private _props: RouteConfig;

  get props(): RouteConfig{
    return this._props;
  }

  set props(val: RouteConfig){
    this._props = val;
  }

  private _blockClass: typeof Block;

  private _block: Block;

  get block() : Block{
    return this._block;
  }

  set block(val: Block){
    this._block = val;
  }

  navigate(pathname: string) {
    if (this.match(pathname)) {
      this.pathname = pathname;
      this.render();
    }
  }

  leave() {
    if (this.block) {
      this.block.hide();
    }
  }

  match(pathname: string) {
    return isEqual(pathname, this.pathname);
  }

  render() {
    if (!this.block) {
      this.block = new this._blockClass({ state: this.props.state, rootQuery: this.props.rootQuery });

    }
    this.block.show();
    return;
  }
}