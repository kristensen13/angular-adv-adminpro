import { Component } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent {

  public imagenSubir!: File;
  public imgTemp: any = null;
  private imgOriginal: any = null;

  constructor(public modalImagenSvc: ModalImagenService,
              public fileUploadSvc: FileUploadService) { }

  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenSvc.cerrarModal();
  }

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
    const id = this.modalImagenSvc.id;
    const tipo = this.modalImagenSvc.tipo;

    this.fileUploadSvc
      .actualizarFoto(this.imagenSubir, tipo, id)
      .then(img => {
        Swal.fire('Guardado', 'Imagen actualizada', 'success');
        this.modalImagenSvc.nuevaImagen.emit(img);
        this.cerrarModal();
      }).catch(err =>{
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
        console.log(err);
      });
  }
}
