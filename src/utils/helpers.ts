import { Dictionary } from '../types/Dictionary';

/** Сравнение двух объектов */
export function isEqual<T extends string | number | boolean | Dictionary, S extends string | number | boolean | Dictionary>(lhs: T, rhs: S): Boolean {
  if (typeof lhs != typeof rhs) {
    return false;
  }
  if (typeof lhs == 'string') {
    return lhs as string === rhs as string;
  }
  if (typeof lhs == 'number') {
    return lhs as number === rhs as number;
  }
  if (typeof lhs == 'object') {
    return Object.keys(lhs).length === Object.keys(rhs).length
      && Object.keys(lhs).every(key => isEqual((lhs as Dictionary)[key], (rhs as Dictionary)[key]));
  }
  return false;
}