import { CanActivateFn, Router } from '@angular/router';


import { inject } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';


export const adminGuard: CanActivateFn = (route, state) => {
  const usuarioSvc = inject(UsuarioService);
  const router = inject(Router);
  console.log('Paso por activate del guard');

  return (usuarioSvc.role === 'ADMIN_ROLE') ? true : router.navigate(['/dashboard']);

};
