import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {
  constructor(
    private usuarioSvc: UsuarioService,
    private router: Router,
    private NgZone: NgZone
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //console.log('Paso por activate del guard');

    return this.usuarioSvc.validarToken().pipe(
      tap((isAuth) => {
        //console.log(estaAutenticado);

        if (!isAuth) {
          //this.NgZone.run(() => {
          this.router.navigateByUrl('/login');
          //});
        }
      })
    );
  }
}
