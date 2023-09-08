import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
})
export class HeaderComponent {
  public imgUrl = '';

  constructor(private usuarioSvc: UsuarioService) {
    this.imgUrl = usuarioSvc.usuario.imagenUrl;
  }

  logout() {
    this.usuarioSvc.logout();
  }
}
