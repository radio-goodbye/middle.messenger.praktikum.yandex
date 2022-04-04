import * as sinon from "sinon";
import { assert } from 'chai';
import { LoginBlock } from "../blocks/pages/LoginBlock";
import { RegisterBlock } from '../blocks/pages/RegisterBlock';
import { SettingsBlock } from '../blocks/pages/SettingsBlock';
import { Router } from "./Router";


describe('Роутер', () => {

    let router: Router;

    beforeEach(() => {
        router = new Router('core_node');
    });

    it('Зарегистрировать путь', () => {
        router.use('/', LoginBlock);
        assert.equal(router.routes.size, 1);
    });

    it('Старт', () => {
        router
            .use('/', LoginBlock)
            .start();

        assert.equal(window.location.pathname, '/');
    });

    it("Переход вперед", () => {
        const forward = sinon.spy(global.window.history, "forward")
        router.forward()
        assert.equal(forward.callCount, 1);
    })

    it("Переход назад", () => {
        const back = sinon.spy(global.window.history, "back")
        router.back()
        assert.equal(back.callCount, 1);
    })

    it('Переход на страницу', () => {
        router
            .use('/', LoginBlock)
            .use('/register', RegisterBlock)
            .use('/settings', SettingsBlock)
            .start();

        router.go('/settings');

        assert.equal(window.location.pathname, '/settings');
    });

   
})