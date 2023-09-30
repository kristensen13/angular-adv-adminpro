import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy{
  public medicos: Medico[] = [];
  public cargando: boolean = true;
  private imgSubs: Subscription = new Subscription;
  public terminoBusqueda: string = '';

  constructor(private medicoSvc: MedicoService,
              private modalImagenSvc: ModalImagenService,
              private busquedasSvc: BusquedasService) { }


  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenSvc.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe(img => {
        this.cargarMedicos()
      });
  }

  cargarMedicos() {
    this.cargando = true;

    this.medicoSvc.cargarMedicos()
      .subscribe((medicos) => {
        this.cargando = false;
        this.medicos = medicos;
      })
  }

  guardarCambios(medico: Medico) {
    this.medicoSvc.actualizarMedico(medico)
      .subscribe((medico: any) => {
        Swal.fire('Médico Actualizado', medico.nombre, 'success');
      })
  }


  //TODO: preguntar si esta seguro de eliminar antes de aceptar
  eliminarMedico(medico: Medico) {
    Swal.fire({
      title: '¿Borrar Médico?',
      text: `Está a punto de eliminar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoSvc.borrarMedico(medico._id!)
          .subscribe(resp => {
            this.cargarMedicos();
            Swal.fire('Médico Eliminado', `${medico.nombre} fue eliminado correctamente`, 'success');
          })
      }
    });
    // this.medicoSvc.borrarMedico(medico._id!)
    //   .subscribe(resp => {
    //     this.cargarMedicos();
    //     Swal.fire('Hospital Eliminado', medico.nombre, 'success');
    //   })
  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear Medico',
      text: 'Ingrese el nombre del médico',
      input: 'text',
      icon: 'info',
      confirmButtonText: 'Guardar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',

    })
    if (value.trim().length > 0) {
      const medico: Medico = { nombre: value };
      this.medicoSvc.crearMedico(medico)
        .subscribe(() => {
          this.cargarMedicos();
          Swal.fire('Médico Creado', value, 'success');
        })
    }

  }

  abrirModal(medico: Medico) {
    this.modalImagenSvc.abrirModal('medicos', medico._id!, medico.img);
  }

  buscarMedico(termino: string) {

    if (termino.length === 0) {
      return this.cargarMedicos();
    }
    this.busquedasSvc.buscar('medicos', termino)
      .subscribe((resp) => {

        this.medicos = resp;
      });
  }
}
