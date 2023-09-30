import { Component, OnDestroy, OnInit } from '@angular/core';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from 'src/app/services/hospital.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  private imgSubs: Subscription = new Subscription;
  public terminoBusqueda: string = '';

  constructor(private hospitalSvc: HospitalService,
              private modalImagenSvc: ModalImagenService,
              private busquedasSvc: BusquedasService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs = this.modalImagenSvc.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe(img => {
        this.cargarHospitales()
      });
  }

  cargarHospitales() {
    this.cargando = true;

    this.hospitalSvc.cargarHospitales()
      .subscribe((hospitales) => {
        this.cargando = false;
        this.hospitales = hospitales;
      })
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalSvc.actualizarHospital(hospital._id!, hospital.nombre)
      .subscribe(resp => {
        console.log(resp);
        Swal.fire('Hospital Actualizado', hospital.nombre, 'success');
      })
  }


  //TODO: preguntar si esta seguro de eliminar antes de aceptar
  eliminarHospital(hospital: Hospital) {
    this.hospitalSvc.borrarHospital(hospital._id!)
      .subscribe(resp => {
        this.cargarHospitales();
        Swal.fire('Hospital Eliminado', hospital.nombre, 'success');
      })
  }

  // async abrirSweetAlert() {
  //   await Swal.fire({
  //     title: 'Crear Hospital',
  //     text: 'Ingrese el nombre del hospital',
  //     input: 'text',
  //     icon: 'info',
  //     confirmButtonText: 'Guardar',
  //     showCancelButton: true,
  //     cancelButtonText: 'Cancelar'
  //   }).then((valor) => {
  //     if (!valor || valor.value.length === 0) {
  //       return;
  //     }
  //     this.hospitalSvc.crearHospital(valor.value)
  //       .subscribe(resp => {
  //         this.cargarHospitales();
  //         Swal.fire('Hospital Creado', valor.value, 'success');
  //       })
  //   })
  // }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del hospital',
      input: 'text',
      icon: 'info',
      confirmButtonText: 'Guardar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',

    })
    if (value.trim().length > 0) {
      this.hospitalSvc.crearHospital(value)
        .subscribe(() => {
          this.cargarHospitales();
          Swal.fire('Hospital Creado', value, 'success');
        })
    }

  }

  abrirModal(hospital: Hospital) {
    this.modalImagenSvc.abrirModal('hospitales', hospital._id!, hospital.img);
  }

  buscarHospital(termino: string) {
    if (termino.length === 0) {
      return this.cargarHospitales();
    }
    this.busquedasSvc.buscar('hospitales', termino)
      .subscribe((hospitales: Hospital[]) => {
        this.hospitales = hospitales;
      });
  }

}
