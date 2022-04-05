import { SignInApi } from '../api/SignInApi';
import { SignOutApi } from '../api/SignOutApi';
import { SignUpApi } from '../api/SignUpApi';
import { Controller } from './Controller';

export class AuthorizeController extends Controller {
  signUpApi: SignUpApi = new SignUpApi();

  signInApi: SignInApi = new SignInApi();

  signOutApi: SignOutApi = new SignOutApi();

  check_user(){
    this.signInApi.request()
      .then((data) => {
        this.store.set('user', data, 'check:complete');
      })
      .catch((err) => {
        this.store.set('error', { code: err.code, text: err.data.reason }, 'check:error');
      });
  }

  register(data: {
    login: string,
    password: string,
    email: string,
    first_name: string,
    second_name: string,
    phone: string
  }) {
    this.signUpApi.create(data)
      .then(() => {
        this.signInApi.request()
          .then((result) => {
            this.store.set('user', result, 'register:complete');
          });
      })
      .catch((err: any) => {
        this.store.set('error', { code: err.code, text: err.data.reason }, 'register:error');
      });
  }

  login(data: {
    login: string,
    password: string,
  }) {
    this.signInApi.create(data)
      .then(() => {
                
        this.signInApi.request().then((result) => {
          this.store.set('user', result, 'login:complete');
        })
          .catch((err: any) => {
            this.store.set('error', { code: err.code, text: err.data.reason }, 'login:error');
          });
      })
      .catch((err: any) => {
        this.store.set('error', { code: err.code, text: err.data.reason }, 'login:error');
      });
  }

  logout(){
    this.signOutApi.create().then(() => {
      this.store.set('user', null, 'logout:complete');
    })
      .catch((err: any) => {
        this.store.set('error', { code: err.code, text: err.data.reason }, 'logout:error');
      });
  }

}