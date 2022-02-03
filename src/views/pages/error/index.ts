import { Component } from '../../../components/common/Component';
const errorPageTemplate = `
<div>
    <h1>{{code}}</h1>
    <h3>{{header}}</h3>
    <h5>{{description}}</h5>
</div>
`;

const page = new Component(errorPageTemplate, {
  code: document.title,
  header: 'Это большая неожиданность',
  description: 'Мы не знаем как Вы сюда попали, но уже делаем все, чтобы Вы никогда не попали сюда снова',
});

page.bindToElement(document.getElementById('form__inner')!);