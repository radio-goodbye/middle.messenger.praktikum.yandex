import { Dictionary } from "../../types/Dictionary";
import { Block } from "../common/Block";

const errorPageTemplate = `
<div id="service_center_block">
    <div>
        <h1>{{code}}</h1>
        <h3>{{header}}</h3>
        <h5>{{description}}</h5>
    </div>
</div>
`;

export class ErrorBlock extends Block{
    public template: string = errorPageTemplate

    componentConfig: Dictionary = {
        code: document.title,
        header: 'Это большая неожиданность',
        description: 'Мы не знаем как Вы сюда попали, но уже делаем все, чтобы Вы никогда не попали сюда снова',
    }
}