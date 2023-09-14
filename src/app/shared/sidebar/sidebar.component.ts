import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  public usuario: Usuario;

  constructor(private sidebarSvc: SidebarService,private usuarioSvc: UsuarioService) {
    this.menuItems = sidebarSvc.menu;
    //console.log(this.menuItems);
    this.usuario = usuarioSvc.usuario;
  }

  logout(){
    this.usuarioSvc.logout();
  }

  ngOnInit(): void {}
}
