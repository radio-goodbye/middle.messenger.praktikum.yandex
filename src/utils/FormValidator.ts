import { Dictionary } from '../types/Dictionary';

/** Валидатор форм */
export class FormValidator {
  /** Собственные поля формы */
  data: Dictionary;

  constructor(fields: string[]) {
    this.data = {};
    fields.forEach((f) => this.data[f] = '');
  }

  /**
     * Получить правила для прохождения проверок поля на валидность
     * @param field Поле
     * @returns
     */
  private _getRegexp(field: string): { rules: RegExp[], name: string, description: string } {
    const fields: { [key: string]: [RegExp[], string, string] } = {
      first_name: [
        [new RegExp(/^[A-ZА-ЯЁ][A-zА-яЁё-]+$/)],
        'Имя',
        'Разрешенные символы: кириллица, латиница и нижнее подчеркивание (_)'],
      second_name: [
        [new RegExp(/^[A-ZА-ЯЁ][A-zА-яЁё-]+$/)],
        'Фамилия',
        'Разрешенные символы: кириллица, латиница и нижнее подчеркивание (_)'],
      login: [
        [new RegExp(/^[A-z0-9_-]{3,20}$/), new RegExp(/^.*[A-z]{1}.*$/)],
        'Логин',
        'Разрешенные символы: латиница, цифры (но не весь логин), дефис (-) и нижнее подчеркивание(_)'],
      email: [
        [new RegExp(/^[A-z]{1}[A-z-_0-9\.]*[A-z]@[A-z]{1}[A-z-_0-9\.]*\.[a-z]+$/)],
        'Электронная почта',
        'Адрес должен быть корректным и без ошибок'],
      password: [
        [new RegExp(/^.{8,40}$/), new RegExp(/^.*[A-Z].*$/), new RegExp(/^.*[0-9].*$/)],
        'Пароль',
        'Длина от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра'],
      oldPassword: [
        [new RegExp(/^.{8,40}$/), new RegExp(/^.*[A-Z].*$/), new RegExp(/^.*[0-9].*$/)],
        'Старый пароль',
        'Длина от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра'],
      newPassword: [
        [new RegExp(/^.{8,40}$/), new RegExp(/^.*[A-Z].*$/), new RegExp(/^.*[0-9].*$/)],
        'Новый пароль',
        'Длина от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра'],
      phone: [
        [new RegExp(/^\+?\d{8,15}$/)],
        'Телефон',
        '10-15 цифр, может начинаться с +'],
      message: [
        [new RegExp(/^.{1,}$/)],
        'Сообщение',
        'Не может быть пустым'],
    };
    return { rules: fields[field][0], name: fields[field][1], description: fields[field][2] };
  }

  /** Проверить новые данные и все поля на валидность */
  checkData(field?: string, value?: string): boolean {
    const errors: {
      name: string,
      description: string
    }[] = [];
    if (field) {
      this.data[field] = value;
    }
    for (var i in this.data) {
      const checks = this._getRegexp(i);
      if (checks) {
        const errorRulesCount = checks.rules.filter((r) => !r.test(this.data[i])).length;
        if (errorRulesCount != 0) {
          errors.push({ name: checks.name, description: checks.description });
        }
      }
    }

    if (errors.length == 0) {
      this.onValid();
      return true;
    }

    let descrGroups: Map<string, { name: string, description: string }[]> = errors.reduce(
      (entryMap, e) => entryMap.set(e.description, [...entryMap.get(e.description) || [], e]),
      new Map(),
    );
    const error = `Ошибки в полях: ${Array.from(descrGroups.keys()).map(desc => {
      return `${descrGroups.get(desc)!.map(e => `"${e.name}"`).join(', ')} (${desc})`;
    }).join('; ')}`;
    this.onValidError(error);
    return false;
  }

  /**
     * Проверить поле на верность введеных данных
     * @param field Поле
     * @param e Событие
     * @returns
     */
  submit(field: string, e: Event | string): boolean {
    if (typeof e == "string"){
      return this.checkData(field, e);
    }
    else return this.checkData(field, (e.target as HTMLInputElement).value);
  }

  /**
     * Функция-триггер при ошибке валидации
     */
  onValidError: (error: string) => void = () => { };

  /**
     * Функция-триггер при успешной валидации
     */
  onValid: () => void = () => { };
}
