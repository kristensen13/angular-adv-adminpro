import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];

  public imgSubs: Subscription = new Subscription;
  public paginaDesde: number = 0;
  public cargando: boolean = true;

  constructor(private usuarioSvc: UsuarioService,
              private busquedasSvc: BusquedasService,
              private modalImagenSvc: ModalImagenService) { }


  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();
   this.imgSubs = this.modalImagenSvc.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(img => {
      this.cargarUsuarios()
    });
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioSvc.cargarUsuarios(this.paginaDesde)
      .subscribe(({ total, usuarios }) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
      });
  }

  cambiarPagina(valor: number) {
    this.paginaDesde += valor;
    if (this.paginaDesde < 0) {
      this.paginaDesde = 0;
    } else if (this.paginaDesde >= this.totalUsuarios) {
      this.paginaDesde -= valor;
    }
    this.cargarUsuarios();
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return this.cargarUsuarios();
    }
    this.busquedasSvc.buscar('usuarios', termino)
      .subscribe((usuarios: Usuario[]) => {
        this.usuarios = usuarios;
      });
  }

  eliminarUsuario(usuario: Usuario) {
    if (usuario.uid === this.usuarioSvc.uid) {
      return Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
    }
    return Swal.fire({
      title: '¿Borrar usuario?',
      text: `Está a punto de eliminar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioSvc.eliminarUsuario(usuario)
          .subscribe(() => {
            this.cargarUsuarios();
            Swal.fire(
              'Usuario eliminado',
              `${usuario.nombre} ha sido eliminado correctamente`,
              'success'
            );
          });
      }
    });

  }

  cambiarRole(usuario: Usuario) {
    this.usuarioSvc.guardarUsuario(usuario)
      .subscribe(() => {
        Swal.fire(
          'Usuario actualizado',
          `${usuario.nombre} ha sido actualizado correctamente`,
          'success'
        );
      });
  }

  abrirModal(usuario: Usuario) {
    this.modalImagenSvc.abrirModal('usuarios', usuario.uid, usuario.img);
  }
}
