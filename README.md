### Макеты в Figma
Макеты находятся по адресу [figma.com](https://www.figma.com/file/FgFe7Pvmq0waQkndGPYIRN/Chat?node-id=0%3A1) 

### Сборка
Сборка выполняется командой `npm run build`

### Запуск
Запуск выполняется командой `npm run start`

### Провека стилей
Проверка стилей с помощью линтеров выполняется командой `npm run lint`

### Супер-запуск
Можно запустить сразу линтеры, затем сборку, затем запуск сервера. Для этого можно использовать команду `npm run superstart`

=======
### О реализации
Шаблонизатор написан самостоятельно.
В качестве примера реализции шаблона MVC я использовал ASP.NET, но изменил кое-что для удобства.
Контроллеры (лежат в папке src/controllers) будут использоваться для реализации логики контроллеров. Сейчас они отвечают за отдачу "каркаса" страницы (лайаут), сгенерированного с помощью шаблонизатора. Но сами внутренности страниц генерируются на клиенте.
Внутренности страниц (стили, шаблоны, index.ts) лежат в папках src/views/pages/**
Сервер использует express.js, логика написана на TS. Поэтому сначала файл сервера нужно странслировать в js, что делает первая часть комманды запуска проекта.
Перед запуском проект его нужно собрать. Рекоммендую использовать команду `npm run superstart`

### Netlify
Страница деплоя: [https://practical-raman-fd69b6.netlify.app](https://practical-raman-fd69b6.netlify.app) 
Использовал маршрутизацию с помощью конфига нетлифая. По умолчанию ссылается на страницу логина. Нас другие страницы можно попасть по ссылкам на страницам (если есть) или с помощью этих ссылок:
[Логин /login](https://practical-raman-fd69b6.netlify.app/login) /
[Регистрация /register](https://practical-raman-fd69b6.netlify.app/register) /
[Настройки пользователя /settings](https://practical-raman-fd69b6.netlify.app/settings) /
[Чат /chat](https://practical-raman-fd69b6.netlify.app/chat) /
[Ошибка 404 /error_404](https://practical-raman-fd69b6.netlify.app/error_404) /
[Ошибка 505 /error_500](https://practical-raman-fd69b6.netlify.app/error_500) /

### Pull request
[github.com](https://github.com/radio-goodbye/middle.messenger.praktikum.yandex/pull/2) 