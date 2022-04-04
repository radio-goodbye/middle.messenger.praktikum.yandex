import { assert } from "chai";
import { Component } from "./Component"

const component = new Component(`
<div class="class_{{class_prefix}}">{{inner_text}}</div>
`, {
    inner_text: 'Вложеный HTML',
    class_prefix: 'super',
});

describe('Блок', () => {
    it('Рендерится верный тег', () => {
        assert.equal(component.element.tagName, 'DIV');
    });

    it('Рендерится верное содержимое', () => {
        assert.equal(component.element.innerHTML, 'Вложеный HTML');
    });

    it('Рендерится подстановка аттрибутов', () => {
        assert.equal(component.element.className, 'class_super');
    });

    it('Работает замена пропсов', () => {
        component.props.inner_text = 'Новый вложенный HTML'
        assert.equal(component.element.innerHTML, 'Новый вложенный HTML');
    });
})