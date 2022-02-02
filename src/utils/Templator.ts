import { get } from './get';
import { Dictionary } from '../types/Dictionary';

/** Контекст компилятора шаблонизатора */
type TemplatorContext = {
  /** Имя контекста */
  name: string,
  /** Объект для компиляции */
  value: Dictionary
};

/** шаблонизатор */
export class Templator {
  /** Обычные теги шаблонизатора */
  TEMPLATE_REGEXP = /\{\{(.*?)\}\}/gi;

  /** Служебные теги шаблонизатора: if, loop, template, bind */
  INTERNAL_TAG_REGEXP  = /\[(if|loop|block|bind)(\s+name=\"(\S+)\")?\s+\{\{(.*)\}\}\s*\](.*)?\s*\[end\1\s+\{\{\4\}\}\s*\]/gms;

  /** Содержимое служебных тегов */
  INTERNAL_TAG_INTRO_REGXP  = /(\S+)\s+(in|as)\s+(\S+)/gms;

  /** Шаблон */
  private _template: string;

  constructor(template: string) {
    this._template = template;
  }

  /**
     * Скомпилировать шаблон с помощью объекта
     * @param context объект компиляции
     * @returns Строка с подмененными значениями
     */
  compile(context: { [key: string] : any }) {
    return this._compile(this._template, { name: 'Основной конктекст', value: context });
  }

  /**
     * Компиляция шаблона объектом
     * @param template Шаблон
     * @param context Объект
     * @returns Строка с подмененными значениями
     */
  private _compile(template: string, context: TemplatorContext): string {
    let tmpl = `${template}`;
    let key = null;

    const intTagRegexp = this.INTERNAL_TAG_REGEXP;
    intTagRegexp.lastIndex = 0;
    while ((key = intTagRegexp.exec(tmpl))) {
      const tag = key[1];
      const name = key[3];
      const scope = key[4];
      const innerText = key[5];
      let newText = '';
      switch (tag) {
        case 'if':
          newText = this._if(innerText, context, get(context.value, scope));
          break;
        case 'loop':
          var scopeTextInro = this._regexp_extract(this.INTERNAL_TAG_INTRO_REGXP, scope);
          if (scopeTextInro) {
            newText = this._each(innerText, context, get(context.value, scopeTextInro[1]) as object, scopeTextInro[3]);
          }
          break;
        case 'block':
          context.value[`__templ_func___${name}`] = this._block(innerText, context, scope, name);
          break;
        case 'bind':
          if (context.value[`__templ_func___${name}`]) {
            newText = context.value[`__templ_func___${name}`](get(context.value, scope));
          }
          break;
      }

      // Я знаю что за ts-ignore нужно давать по рукам, но я так и не сумел заставить parcel распознавать подключенные либы в tsconfig
      // Как только перейдем на вебпак - уберу это позорище
      // @ts-ignore
      tmpl = tmpl.replaceAll(key[0], newText);
      intTagRegexp.lastIndex = 0;
    }

    const templateRegexp = this.TEMPLATE_REGEXP;
    key = null;
    while ((key = templateRegexp.exec(tmpl)) != null) {
      if (key[1]) {
        const tmplValue = key[1].trim();
        const data = get(context.value, tmplValue);
        if (data != undefined) {
          tmpl = tmpl.replace(new RegExp(key[0], 'gi'), data.toString());
        } else {
          tmpl = tmpl.replace(new RegExp(key[0], 'gi'), `<{<${key[1]}>}>`);
        }
        templateRegexp.lastIndex = 0;
      }
    }
    const undefinedElementsRegexp = /\<\{\<(.*?)\>\}\>/gi;
    key = null;
    while ((key = undefinedElementsRegexp.exec(tmpl)) != null) {
      if (key[1]) {
        tmpl = tmpl.replace(new RegExp(key[0], 'gi'), `{{${key[1]}}}`);
        undefinedElementsRegexp.lastIndex = 0;
      }
    }

    return tmpl;
  }

  /**
     * Достать первое совпадение регекспом из строки
     * @param regexp регексп-шаблон
     * @param str Строка
     * @returns Первое совпадение в строке если оно есть
     */
  private _regexp_extract(regexp: RegExp, str: string): RegExpExecArray | null {
    let key: RegExpExecArray | null = null;

    let arr : RegExpExecArray | null = null;
    while ((key = regexp.exec(str))) {
      if (arr) continue;
      arr = key;
    }

    return arr;
  }

  /**
     * Объединить два контекста. При совпадении в ключах объектов выдает ошибку
     * @param oldContext Первый контекст
     * @param newContext Второй контекст
     * @returns Новый контекст, состоящий из двух старых
     */
  private _mergeContexts(oldContext: TemplatorContext, newContext: TemplatorContext): TemplatorContext {
    const keysOld = Object.keys(oldContext.value); const
      keysNew = Object.keys(newContext.value);
    const intersectedKeys = keysOld.filter((value) => keysNew.includes(value));
    if (intersectedKeys.length != 0) {
      throw new Error(`${oldContext.name} и ${newContext.name} имеют общие ключи: ${intersectedKeys.join(', ')}`);
    } else return { name: `${oldContext.name}=>${newContext.name}`, value: { ...oldContext.value, ...newContext.value } };
  }

  /**
     * Обработка служебного тега IF
     * @param innerTemplate Внутренний шаблон
     * @param parentCtx Родительский контекст
     * @param if_variable_value Значение переменной if
     * @returns Скомпилированная подстрока
     */
  private _if(innerTemplate: string, parentCtx: TemplatorContext, if_variable_value: any): string {
    if (!if_variable_value) {
      return '';
    }
    return this._compile(innerTemplate, parentCtx);
  }

  /**
     * Обработка служебного тега LOOP
     * @param innerTemplate Внутренний шаблон
     * @param parentCtx Родительский контекст
     * @param loop_variable_value Значение переменной для перебора
     * @param elementName Название элемента
     * @returns
     */
  private _each(innerTemplate: string, parentCtx: TemplatorContext, loop_variable_value: any, elementName: string): string {
    if (!loop_variable_value) {
      return '';
    }
    if (Array.isArray(loop_variable_value)) {
      if (loop_variable_value.length == 0) return '';
      const arr = loop_variable_value.map((element, i) => {
        const elementContext: Dictionary = {};
        elementContext[elementName] = element;
        elementContext[`${elementName}_i`] = i;
        const mergedContext = this._mergeContexts(parentCtx, { name: elementName, value: elementContext });
        return this._compile(innerTemplate, mergedContext);
      });
      return arr.join('\n');
    }
    if (typeof loop_variable_value === 'object') {
      if (Object.keys(loop_variable_value).length == 0) return '';
      const arrObj = Object.keys(loop_variable_value).map((key) => {
        const elementContext: Dictionary = {};
        elementContext[`${elementName}_key`] = key;
        elementContext[`${elementName}_value`] = loop_variable_value[key];
        const mergedContext = this._mergeContexts(parentCtx, { name: elementName, value: elementContext });
        return this._compile(innerTemplate, mergedContext);
      });
      return arrObj.join('\n');
    }
    throw new Error(`Объект "${elementName}" не предназначен для перебора`);
  }

  /**
     * Реализация служебного тега BLOCK (подшаблон)
     * @param innerTemplate Внутренний шаблон
     * @param parentCtx Родительский контекст
     * @param context_obj_name Название контекста
     * @param id Идентификатор шаблона
     * @returns Функция, которая компилирует сохраненный ранее шаблон в строку с помощью объекта
     */
  private _block(innerTemplate: string, parentCtx: TemplatorContext, context_obj_name: string, id: string): (obj: object) => string {
    return (bindedObj) => {
      const newCtxValue: Dictionary = {};
      newCtxValue[context_obj_name] = bindedObj;
      const mergedContext = this._mergeContexts(parentCtx, { name: `Шаблон: ${id}`, value: newCtxValue });
      return this._compile(innerTemplate, mergedContext);
    };
  }
}
