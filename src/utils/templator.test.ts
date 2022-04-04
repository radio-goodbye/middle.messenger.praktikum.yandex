import { assert } from 'chai';
import { Templator } from './Templator';

describe('Шаблонизатор', () => {
    it('Простая замена', () => {
        let tmp = new Templator('1{{data}}1');
        assert.equal(tmp.compile({ data: 2 }), '121');
    })

    it('Вложенный объект', () => {
        let tmp = new Templator('1{{data.bing}}1');
        assert.equal(tmp.compile({ data: {bing: 2} }), '121');
    })

    it('Защита от XSS', () => {
        let tmp = new Templator('1<script>1</script>');
        assert.equal(tmp.compile({ }), '11');
    })

    it('Шаблонизация списка', () => {
        let tmp = new Templator('[loop {{data as d}}]{{d}}[endloop {{data as d}}]');
        assert.equal(tmp.compile({ data: [1,2,3]}), '123');
    })

    it('Шаблонизация условия', () => {
        let tmp = new Templator('[if {{true_val}}]{{val1}}[endif {{true_val}}][if {{false_val}}]{{val2}}[endif {{false_val}}]');
        assert.equal(tmp.compile({ true_val: true, false_val: false, val1: 'is_true', val2: 'is_false'}), 'is_true');
    })
})