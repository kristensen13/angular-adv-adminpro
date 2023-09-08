import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Usuario } from '../models/usuario.model';

declare const google: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public usuario!: Usuario;
  constructor(
    private http: HttpClient,
    private router: Router,
    private NgZone: NgZone
  ) {}

  logout() {
    localStorage.removeItem('token');
    //this.router.navigateByUrl('/login');
    google.accounts.id.revoke('2bitstechnology@gmail.com', () => {
      this.NgZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });

    // google.accounts.id.revoke('2bitstechnology@gmail.com', (done: any) => {
    //   console.log('consent revoked');
    // });
  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';

    return this.http
      .get(`${base_url}/login/renew`, {
        headers: {
          'x-token': token,
        },
      })
      .pipe(
        tap((resp: any) => {
          console.log(resp);
          const { nombre, email, google, img, role, uid } = resp.usuario;
          this.usuario = new Usuario(nombre, email, '', google, img, role, uid);

          localStorage.setItem('token', resp.token);
        }),
        map((resp) => true),
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
        //console.log(resp);
        localStorage.setItem('token', resp.token);
      })
    );
  }
}