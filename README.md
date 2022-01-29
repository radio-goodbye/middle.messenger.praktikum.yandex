### Макеты в Figma
Макеты находятся по адресу [figma.com](https://www.figma.com/file/FgFe7Pvmq0waQkndGPYIRN/Chat?node-id=0%3A1) 

### Сборка
Сборка выполняется командой `npm run build`

### Запуск
Запуск выполняется командой `npm run start`
=======
### Netify
Страница деплоя: [https://practical-raman-fd69b6.netlify.app](https://practical-raman-fd69b6.netlify.app)\
В качестве индексной страницы у меня используется логин (или редирект на чат если залогинен, но это в будущем). Так как у меня используется онлайн-компиляция шаблонов в HTML при запросе, а netlify не запускает без танцев с бубном express.js, то и файла index.html у меня нет. То есть страница деплоя открывается с ошибкой. \
Но! Я скомпилировал пример уже скомпилированных шаблонов в статические файлы, они доступны по адресам:\
[login](https://practical-raman-fd69b6.netlify.app/pages/examples/login.html) \
[register](https://practical-raman-fd69b6.netlify.app/pages/examples/register.html) \
[settings](https://practical-raman-fd69b6.netlify.app/pages/examples/settings.html) \
[chat](https://practical-raman-fd69b6.netlify.app/pages/examples/chat.html) \
[error 404](https://practical-raman-fd69b6.netlify.app/pages/examples/error_404.html) \
[error 500+](https://practical-raman-fd69b6.netlify.app/pages/examples/error_500_and_more.html)

### Pull request
[github.com](https://github.com/radio-goodbye/middle.messenger.praktikum.yandex/pull/1) 
