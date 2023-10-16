import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, NgZone } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

declare const google: any;
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AuthGoogleService implements OnInit {

  public usuario!: Usuario;
  public auth2: any;

  constructor(private oauthSvc: OAuthService,
    private http: HttpClient,
    private router: Router,
    private NgZone: NgZone) {
    //this.initGoogle();
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.validarToken().subscribe();
    }, 1500);
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }


  initGoogle() {
    const config: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId: '380996317376-pbjdh9srljth9aijqt3f19vv2fb764i2.apps.googleusercontent.com',
      redirectUri: window.location.origin + '/dashboard',
      scope: 'openid profile email',
    }

    this.oauthSvc.configure(config);
    this.oauthSvc.setupAutomaticSilentRefresh();
    this.oauthSvc.loadDiscoveryDocumentAndTryLogin();

  }

  login() {
    this.oauthSvc.initLoginFlow();
  }

  logout() {
    this.oauthSvc.revokeTokenAndLogout();
   // this.oauthSvc.logOut();
  }

  getProfile() {
    const claims = this.oauthSvc.getIdentityClaims();
    return claims ? claims : null;
  }

  getAccessToken() {
    return this.oauthSvc.getAccessToken();
  }


  ///////////////////////////////////////////
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

  guardarLocalStorage(token: string, menu: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  googleInit() {
    return new Promise<void>((resolve, reject) => {
      if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        this.auth2 = google.accounts.id.initialize({
          client_id:
            '380996317376-pbjdh9srljth9aijqt3f19vv2fb764i2.apps.googleusercontent.com',
          callback: (response: any) => this.handleCredentialResponse(response),
        });
        resolve();
      } else {
        reject('Google API not loaded');
      }
    });
  }


  handleCredentialResponse(response: any) {
    this.loginGoogle(response.credential).subscribe((resp) => {
      this.NgZone.run(() => {
        this.router.navigateByUrl('/');
      });
    });
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    );
  }

}
