const express = require('express')
const { compileLoginTemplate } = require('./pages/login')
const { compileRegisterTemplate } = require('./pages/register')
const { compileSettingsTemplate } = require('./pages/settings')
const { compileChatTemplate } = require('./pages/chat')
const { compile404Template } = require('./pages/error_404')
const { compile500AndMoreTemplate } = require('./pages/error_500_and_more')
const app = express()
const port = 3000

var templates = {
  login() {
    var data = {
      login_fields: [
        { name: 'login', type: 'text', title: 'Логин', value: '', placeholder: 'example' },
        { name: 'password', type: 'password', title: 'Пароль', value: '', placeholder: '**********' },
      ],
      title: 'Вход: Messenger'
    }
    return compileLoginTemplate(data)
  },
  register() {
    var data = {
      register_fields: [
        [{ name: 'email', type: 'text', title: 'EMail', value: '', placeholder: 'example@example.com' },],
        [{ name: 'login', type: 'text', title: 'Логин', value: '', placeholder: 'example' }],
        [{ name: 'password', type: 'password', title: 'Пароль', value: '', placeholder: '**********' }],
        [
          { name: 'first_name', type: 'text', title: 'Имя', value: '', placeholder: 'Иван' },
          { name: 'second_name', type: 'text', title: 'Фамилия', value: '', placeholder: 'Иванов' },
        ],
        [{ name: 'phone', type: 'text', title: 'Телефон', value: '', placeholder: '+7-800-555-3535' }],
      ],
      title: 'Регистрация: Messenger'
    };

    return compileRegisterTemplate(data)
  },
  settings() {
    var data = {
      settings_fields: [
        [
          { is_input: true, name: 'email', type: 'text', title: 'EMail', value: '', placeholder: 'example@example.com' },
          { is_image: true, src: 'url(https://i.pravatar.cc/150)' },
        ],
        [
          { is_input: true, name: 'login', type: 'text', title: 'Логин', value: '', placeholder: 'example' },
          { is_file: true, name: 'avatar', title: 'Аватар', accept: 'image/png, image/jpg' }
        ],
        [
          { is_input: true, name: 'oldPassword', type: 'password', title: 'Старый пароль', value: '', placeholder: '**********' },
          { is_input: true, name: 'newPassword', type: 'password', title: 'Новый пароль', value: '', placeholder: '**********' }
        ],
        [
          { is_input: true, name: 'first_name', type: 'text', title: 'Имя', value: '', placeholder: 'Иван' },
          { is_input: true, name: 'second_name', type: 'text', title: 'Фамилия', value: '', placeholder: 'Иванов' },
        ],
        [
          { is_input: true, name: 'phone', type: 'text', title: 'Телефон', value: '', placeholder: '+7-800-555-3535' },
          { is_input: true, name: 'display_name', type: 'text', title: 'Отображаемое имя', value: '', placeholder: 'Иваныч777' }],
      ],
      title: 'Настройки пользователя: Messenger'
    };

    return compileSettingsTemplate(data);
  },
  chat() {
    return compileChatTemplate({ title: 'Messenger: Чат' })
  },
  error_404() {
    return compile404Template({ title: 'Messenger: OOPS' })
  },
  error_500_and_more() {
    return compile500AndMoreTemplate({ title: 'Messenger: OOPS', error_code: 505, error_text: "Все сломалось :(" })
  }
}

app.use(express.static('dist', { extensions: ['scss', 'css'] }));


app.get('/', (req, res) => {
  res.send(templates.login())
})

app.get('/register', (req, res) => {
  res.send(templates.register())
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})