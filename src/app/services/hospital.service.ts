import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';
import { Observable } from 'rxjs';


const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {


  constructor(private http: HttpClient) { }


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

  cargarHospitales() {//TODO: crear paginación para usar en varios sitios
    const url = `${base_url}/hospitales`;
    return this.http.get(url, this.headers)
    .pipe(
      map((resp: any) => {
        if (Array.isArray(resp?.hospitales)) {
          return resp.hospitales as Hospital[];
        } else {
          return [];
        }
      })
    );
  }

  crearHospital(nombre: string) {
    const url = `${base_url}/hospitales`;
    return this.http.post(url, { nombre }, this.headers)
      .pipe(
        map((resp: any) => resp.hospital)
      );
  }

  actualizarHospital(_id: string, nombre: string) {
    const url = `${base_url}/hospitales/${_id}`;
    return this.http.put(url, {nombre}, this.headers);
  }

  borrarHospital(_id: string) {
    const url = `${base_url}/hospitales/${_id}`;
    return this.http.delete(url, this.headers);
  }
}
