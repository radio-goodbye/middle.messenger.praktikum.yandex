require('regenerator-runtime');
const { JSDOM } = require('jsdom');
const register = require('@babel/register').default;
const sinon = require('sinon');
const FormData = require('form-data');

register({ extensions: ['.ts', '.js'] });
const dom = new JSDOM('<div id="core_node"><div>', { url: 'http://localhost' });

let _localStorage = {
    _data: {},
    getItem(key){return this._data[key]},
    setItem(key,val){this._data[key] = val}
}

global.window = dom.window;
global.document = dom.window.document;
global.localStorage = _localStorage;
global.FormData = FormData;