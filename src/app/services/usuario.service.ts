import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Usuario } from '../models/usuario.model';
import { OAuthService } from 'angular-oauth2-oidc';

declare const google: any;
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public usuario!: Usuario;
  public auth2: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private NgZone: NgZone,
    private OauthSvc: OAuthService
  ) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  validarToken(): Observable<boolean> {

    return this.http
      .get(`${base_url}/login/renew`, {
        headers: {
          'x-token': this.token,
        },
      })
      .pipe(
        map((resp: any) => {
          //console.log(resp);
          const { nombre, email, google, img = '', role, uid } = resp.usuario;
          this.usuario = new Usuario(nombre, email, '', google, img, role, uid);
          localStorage.setItem('token', resp.token);
          return true;
        }),
        catchError((error) => of(false))
      );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  actualizarPerfil(data: { email: string, nombre: string, role: any }) { //TODO: crear interfaz para la data

    data = {
      ...data,
      role: this.usuario.role
    }
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, {
      headers: {
        'x-token': this.token,
      }
    })
  }

  googleInit() {
    return new Promise<void>(resolve => {
      this.auth2 = google.accounts.id.initialize({
        client_id:
          '380996317376-pbjdh9srljth9aijqt3f19vv2fb764i2.apps.googleusercontent.com',
        callback: (response: any) => this.handleCredentialResponse(response),
      });
      resolve();
    });
  }

  handleCredentialResponse(response: any) {
    this.loginGoogle(response.credential).subscribe((resp) => {
      this.NgZone.run(() => {
        this.router.navigateByUrl('/');
      });
    });
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  logout() {
    this.OauthSvc.logOut();
    localStorage.removeItem('token');
    //this.router.navigateByUrl('/login');

    google.accounts.id.revoke('2bitstechnology@gmail.com', () => {
      this.NgZone.run(() => {

        // if (done.status === "ok") {
        //   console.log('Token revocado con éxito');
        // } else {
        //   console.error('Error al revocar el token:', done);
        // }
        this.router.navigateByUrl('/login');
      });
    });
  }
}
