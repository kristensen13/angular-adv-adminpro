import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm: FormGroup = new FormGroup({});
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado: Hospital | undefined;
  public medicoSeleccionado: Medico | undefined;

  constructor(private fb: FormBuilder,
    private hospitalSvc: HospitalService,
    private medicoSvc: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(({ id }) => this.cargarMedico(id));

    this.medicoSvc.cargarMedicoPorId(this.router.url.split('/')[3])

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });

    this.cargarHospitales();

    this.medicoForm.get('hospital')?.valueChanges
      .subscribe(hospitalId => {
        this.hospitalSeleccionado = this.hospitales.find(h => h._id === hospitalId)!;
      });
  }

  cargarMedico(id: string) {
    if (id === 'nuevo') {
      return;
    }

    return this.medicoSvc.cargarMedicoPorId(id)
      .pipe(
        delay(100)
      )
      .subscribe(medico => {

        if (!medico) {
          return this.router.navigateByUrl(`/dashboard/medicos`);
        }
        const { nombre, hospital: { _id } } = medico;

        this.medicoSeleccionado = medico;
        this.medicoForm.setValue({ nombre, hospital: _id });
        return;
      });
  }

  cargarHospitales() {
    this.hospitalSvc.cargarHospitales()
      .subscribe((hospitales: Hospital[]) => {
        this.hospitales = hospitales;
      });
  }

  // cargarHospitales(){
  //   this.medicoForm.get('hospital')?.valueChanges
  //   .subscribe(hospitalId => {
  //     this.hospitalSeleccionado = this.hospitales.find(h => h._id === hospitalId)!;

  //   });
  // }

  guardarMedico() {
    console.log(this.medicoSeleccionado);
    const { nombre } = this.medicoForm.value;
    if (this.medicoSeleccionado) {
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoSvc.actualizarMedico(data)
        .subscribe(resp => {
          Swal.fire('Actualizado', `${nombre} actualizado correctamente`, 'success');
        });
    } else {
      this.medicoSvc.crearMedico(this.medicoForm.value)
        .subscribe((resp: any) => {
          console.log(resp);
          Swal.fire('Creado', `${nombre} creado correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
        });
    }


  }

}
