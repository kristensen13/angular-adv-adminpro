import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm!: FormGroup;
  public usuario: Usuario;
  public imagenSubir!: File;
  public imgTemp: any = null;
  private imgOriginal: any = null;

  constructor(private fb: FormBuilder,
    private usuarioSvc: UsuarioService,
    private fileUploadSvc: FileUploadService) {
    this.usuario = usuarioSvc.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
    })
    this.imgOriginal = this.usuario.img;
  }

  actualizarPerfil() {
    console.log(this.perfilForm.value);
    this.usuarioSvc.actualizarPerfil(this.perfilForm.value)
      .subscribe(() => {
        const { nombre, email } = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;
        //TODO: colocar sweet alert confirmando los cambios
      })
  }

  // cambiarImagen(file: File) {

  //   this.imagenSubir = file;

  //   if (!file) {
  //     return this.imgTemp = null;
  //     ; }

  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);

  //   reader.onloadend = () => {
  //     this.imgTemp = reader.result!.toString();

  //   }

  // }

  cambiarImagen(event: Event) { //TODO: Conseguir que al cancelar la seleccion de imagen vuelva a previsualizar la imagen que se encuentra seleccionada en ese momento
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.imagenSubir = file;
      console.log(file);
      console.log(this.imgOriginal);

      if (!file) {
        this.imgTemp = null;
        console.log('imgTemp: ', this.imgTemp);

        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {

        this.imgTemp = reader.result!.toString();

      }

    }

  }

  subirImagen() {
    this.fileUploadSvc
      .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid!)
      .then(img => this.usuario.img = img);
  }

}
