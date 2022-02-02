/** Валидатор форм */
export class FormValidator {
  /** Собственные поля формы */
  data: object;

  constructor(fields: string[]) {
    this.data = {};
    fields.forEach((f) => this.data[f] = '');
  }

  /**
     * Получить правила для прохождения проверок поля на валидность
     * @param field Поле
     * @returns
     */
  private _getRegexp(field: string):{ rules: RegExp[], name: string } {
    const fields: { [key: string]: [RegExp[], string] } = {
      first_name: [[new RegExp(/^[A-ZА-ЯЁ][A-zА-яЁё-]+$/)], 'Имя'],
      second_name: [[new RegExp(/^[A-ZА-ЯЁ][A-zА-яЁё-]+$/)], 'Фамилия'],
      login: [[new RegExp(/^[A-z0-9_-]{3,20}$/), new RegExp(/^.*[A-z]{1}.*$/)], 'Логин'],
      email: [[new RegExp(/^[A-z]{1}[A-z-_0-9\.]*[A-z]@[A-z]{1}[A-z-_0-9\.]*\.[a-z]+$/)], 'Электронная почта'],
      password: [[new RegExp(/^.{8,40}$/), new RegExp(/^.*[A-Z].*$/), new RegExp(/^.*[0-9].*$/)], 'Пароль'],
      oldPassword: [[new RegExp(/^.{8,40}$/), new RegExp(/^.*[A-Z].*$/), new RegExp(/^.*[0-9].*$/)], 'Старый пароль'],
      newPassword: [[new RegExp(/^.{8,40}$/), new RegExp(/^.*[A-Z].*$/), new RegExp(/^.*[0-9].*$/)], 'Новый пароль'],
      phone: [[new RegExp(/^\+?\d{8,15}$/)], 'Телефон'],
      message: [[new RegExp(/^.{1,}$/)], 'Сообщение'],
    };
    console.log(field, fields[field]);
    return { rules: fields[field][0], name: fields[field][1] };
  }

  /** Проверить новые данные и все поля на валидность */
  checkData(field?: string, value?: string) : boolean {
    const errors: string[] = [];
    if (field) {
      this.data[field] = value;
    }

    console.log(this.data);

    for (var i in this.data) {
      const checks = this._getRegexp(i);
      if (checks) {
        const errorRulesCount = checks.rules.filter((r) => !r.test(this.data[i])).length;
        if (errorRulesCount != 0) {
          errors.push(checks.name);
        }
      }
    }

    if (errors.length == 0) {
      this.onValid();
      return true;
    }

    const error = `Ошибки в полях: ${errors.join(', ')}`;
    this.onValidError(error);
    return false;
  }

  /**
     * Проверить поле на верность введеных данных
     * @param field Поле
     * @param e Событие
     * @returns
     */
  submit(field: string, e: Event) : boolean {
    return this.checkData(field, (e.target as HTMLInputElement).value);
  }

  /**
     * Функция-триггер при ошибке валидации
     */
  onValidError: (error: string) => void = () => {};

  /**
     * Функция-триггер при успешной валидации
     */
  onValid: () => void = () => {};
}
