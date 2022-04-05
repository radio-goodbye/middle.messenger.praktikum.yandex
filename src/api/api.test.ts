import * as sinon from 'sinon';
import { SignInApi } from './SignInApi';
import { assert } from 'chai';
import { ChatListApi } from './ChatListApi';
import { SignOutApi } from './SignOutApi';

describe('Тесты API', () => {
  const requests: sinon.SinonFakeXMLHttpRequest[] = [];
  let xhr: sinon.SinonFakeXMLHttpRequestStatic;
  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest();
    (global as any).XMLHttpRequest = sinon.useFakeXMLHttpRequest();

    xhr.onCreate = (request: sinon.SinonFakeXMLHttpRequest) => {
      requests.push(request);
    };
  });

  afterEach(function () {
    xhr.restore();
  });

  it('Метод авторизации', (done) => {
    let api = new SignInApi();

    let data = {
      login: 'copybara101',
      password: 'Querty123',
    };

    api.create(data).then(() => {
      var req = requests[0];

      assert.equal(req.method, 'POST');
      assert.equal(req.status, 200);

      done();
    });
            

    requests[0].respond(200, { 'Content-Type': 'text/json' }, '');
  });

  it('Получение списка чатов', (done) => {
    let api = new ChatListApi();
    api.request().then(() => {
      var req = requests[1];
      assert.equal(req.method, 'GET');
      assert.equal(req.status, 200);
      done();
    });

    requests[1].respond(200, { 'Content-Type': 'text/json' }, '');
  });

  it('Выход', (done) => {
    let api = new SignOutApi();
    api.create().then(() => {
      var req = requests[2];
      assert.equal(req.method, 'POST');
      assert.equal(req.status, 200);
      done();
    });

    requests[2].respond(200, { 'Content-Type': 'text/json' }, '');
  });
});