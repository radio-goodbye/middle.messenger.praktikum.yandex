const fs = require('fs');

class Templator {
    TEMPLATE_REGEXP = /\{\{(.*?)\}\}/gi;

    /** Служебные теги шаблонизатора: if, loop, template, bind */
    INTERNAL_TAG_REGEXP = /\[(if|loop|block|bind)(\s+name=\"(\S+)\")?\s+\{\{(.*)\}\}\s*\](.*)?\s*\[end\1\s+\{\{\4\}\}\s*\]/gms;

    /** Содержимое служебных тегов */
    INTERNAL_TAG_INTRO_REGXP = /(\S+)\s+(in|as)\s+(\S+)/gms;

    constructor(template) {
        this._template = template;
    }

    compile(context) {
        return this._compile(this._template, { name: 'Основной конктекст', value: context });
    }

    _compile(template, context) {
        let tmpl = `${template}`;
        let key = null;

        const intTagRegexp = this.INTERNAL_TAG_REGEXP;
        intTagRegexp.lastIndex = 0;
        while ((key = intTagRegexp.exec(tmpl))) {
            let tag = key[1],
                name = key[3],
                scope = key[4],
                innerText = key[5];
            var newText = "";
            switch (tag) {
                case 'if':
                    newText = this._if(innerText, context, this._get(context.value, scope));
                    break;
                case 'loop':
                    var scopeTextInro = this._regexp_extract(this.INTERNAL_TAG_INTRO_REGXP, scope);
                    newText = this._each(innerText, context, this._get(context.value, scopeTextInro[1]), scopeTextInro[3]);
                    break;
                case 'block':
                    context.value[`__templ_func___${name}`] = this._block(innerText, context, scope, name);
                    break;
                case 'bind':
                    if (context.value[`__templ_func___${name}`]) {
                        newText = context.value[`__templ_func___${name}`](this._get(context.value, scope));
                    }
                    break;
            }

            tmpl = tmpl.replaceAll(key[0], newText);
            intTagRegexp.lastIndex = 0;

        }

        const templateRegexp = this.TEMPLATE_REGEXP;
        key = null;
        while (null != (key = templateRegexp.exec(tmpl))) {
            if (key[1]) {
                const tmplValue = key[1].trim();
                const data = this._get(context.value, tmplValue);


                if (typeof data === "function") {
                    window[tmplValue] = data;
                    tmpl = tmpl.replace(
                        new RegExp(key[0], "gi"),
                        `window.${key[1].trim()}()`
                    );
                    continue;
                }

                tmpl = tmpl.replace(new RegExp(key[0], "gi"), data);
                templateRegexp.lastIndex = 0;

            }
        }

        return tmpl;
    }

    _regexp_extract(regexp, str) {
        const reg = regexp;
        let key = null;

        var arr = null;
        while ((key = regexp.exec(str))) {
            if (arr) continue;
            arr = key;
        }

        return arr;
    }

    _get(obj, path, defaultValue) {
        const keys = path.split('.');

        let result = obj;
        for (let key of keys) {
            result = result[key];

            if (result === undefined) {
                return defaultValue;
            }
        }

        return result ?? defaultValue;
    }
    _mergeContexts(oldContext, newContext) {
        var keysOld = Object.keys(oldContext.value), keysNew = Object.keys(newContext.value);
        var intersectedKeys = keysOld.filter(value => keysNew.includes(value));
        if (intersectedKeys.length != 0) {
            throw `${oldContext.name} и ${newContext.name} имеют общие ключи: ${intersectedKeys.join(', ')}`;
        }
        else return { name: `${oldContext.name}=>${newContext.name}`, value: Object.assign({}, oldContext.value, newContext.value) };
    }

    _if(innerTemplate, parentCtx, if_variable_value) {
        if (!if_variable_value) {
            return '';
        }
        else return this._compile(innerTemplate, parentCtx);
    }

    _each(innerTemplate, parentCtx, loop_variable_value, elementName) {
        if (!loop_variable_value) {
            return '';
        }
        if (Array.isArray(loop_variable_value)) {
            if (loop_variable_value.length == 0) return '';
            var arr = loop_variable_value.map((element, i) => {
                var elementContext = {};
                elementContext[elementName] = element;
                elementContext[`${elementName}_i`] = i;
                var mergedContext = this._mergeContexts(parentCtx, { name: elementName, value: elementContext });
                return this._compile(innerTemplate, mergedContext);
            });
            return arr.join('\n');
        }
        else if (typeof loop_variable_value == 'object') {
            if (Object.keys(loop_variable_value).length == 0) return '';
            var arr = Object.keys(loop_variable_value).map(key => {
                var elementContext = {};
                elementContext[`${elementName}_key`] = key;
                elementContext[`${elementName}_value`] = loop_variable_value[key];
                var mergedContext = this._mergeContexts(parentCtx, { name: elementName, value: elementContext });
                return this._compile(innerTemplate, mergedContext);
            });
            return arr.join('\n');
        }
        else throw `Объект "${elementName}" не предназначен для перебора`;
    }

    _block(innerTemplate, parentCtx, context_obj_name, id) {
        return (bindedObj) => {
            var newCtxValue = {};
            newCtxValue[context_obj_name] = bindedObj;
            var mergedContext = this._mergeContexts(parentCtx, { name: `Шаблон: ${id}`, value: newCtxValue });
            return this._compile(innerTemplate, mergedContext);
        };
    }

}

function fastCompile(filepath, context) {
    try {
        var path = filepath.replace(process.cwd() + '/src', process.cwd() + '/dist');
        var text = fs.readFileSync(path, 'utf8');
        var templator = new Templator(text);
        var newHtml = templator.compile(context);
        return newHtml;
    }
    catch (err) {
        return `<div style="color: red">${err.stack}</div>`;
    }
}

module.exports = { Templator, fastCompile }