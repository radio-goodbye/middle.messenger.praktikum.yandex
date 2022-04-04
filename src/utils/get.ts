import { Dictionary } from '../types/Dictionary';

/**
 * Получить значение из объекта по ключу
 * @param obj Объект
 * @param path Ключ (если есть точки, то перебирается по вложениям)
 * @param defaultValue Значение по умолчанию
 * @returns Полученный результат
 */
export const get = function (obj: Dictionary, path: string, defaultValue?: any): any {
  const keys = path.split('.');

  let result: Dictionary = obj;
  for (const key of keys) {

    result = result[key];

    if (result === undefined) {
      return defaultValue;
    }
  }

  return result ?? defaultValue;
};
