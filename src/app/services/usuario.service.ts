import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';
import { AuthGoogleService } from './auth-google.service';

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
    private authSvc: AuthGoogleService,
    private ngZone: NgZone
  ) {
    this.authSvc.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role!;
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  guardarLocalStorage(token: string, menu: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  validarToken(): Observable<boolean> {

    return this.http
      .get(`${base_url}/login/renew`, this.headers)
      .pipe(
        map((resp: any) => {
          //console.log(resp);
          const { nombre, email, google, img = '', role, uid } = resp.usuario;
          this.usuario = new Usuario(nombre, email, '', google, img, role, uid);
          this.guardarLocalStorage(resp.token, resp.menu);
          return true;
        }),
        catchError((error) => of(false))
      );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData).pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    );
  }

  actualizarPerfil(data: { email: string, nombre: string, role: any }) { //TODO: crear interfaz para la data

    data = {
      ...data,
      role: this.usuario.role
    }
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers)
  }

  guardarUsuario(usuario: Usuario) {
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers)
  }

  cargarUsuarios(desde: number = 0) {
    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.headers)
      .pipe(
        map((resp: any) => {
          const usuarios = resp.usuarios.map(
            (user: any) => new Usuario(user.nombre, user.email, '', user.google, user.img, user.role, user.uid)
          )
          return {
            total: resp.total,
            usuarios
          };
        })
      )
  }

  eliminarUsuario(usuario: Usuario) {
    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers);
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    );
  }

  logout() {
    //this.oauthSvc.logOut();



    google.accounts.id.revoke(this.usuario.email, () => {
      console.log(this.usuario.email + ' has disconnected');

      this.ngZone.run(() => {
        //this.authSvc.logout();
        localStorage.removeItem('token');
        localStorage.removeItem('menu');
        this.router.navigateByUrl('/login');
      })
      // this.router.navigate(['/login']);
    });

  }

}
