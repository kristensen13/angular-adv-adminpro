import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  NgZone,
} from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('googleBtn')
  googleBtn!: ElementRef;

  public formSubmitted = false;
  public auth2: any;

  public loginForm = this.fb.group({
    email: [
      localStorage.getItem('email') || '',
      [Validators.required, Validators.email],
    ],
    password: ['', Validators.required],
    remember: [false],
  });

  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private usuarioSvc: UsuarioService,
    private NgZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id:
        '380996317376-pbjdh9srljth9aijqt3f19vv2fb764i2.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response),
    });
    google.accounts.id.renderButton(
      //document.getElementById('buttonDiv'),
      this.googleBtn.nativeElement,
      { theme: 'outline', size: 'large' } // customization attributes
    );
  }

  handleCredentialResponse(response: any) {
    //console.log('Encoded JWT ID token' + response.credential);
    this.usuarioSvc.loginGoogle(response.credential).subscribe((resp) => {
      //console.log({ login: resp });
      this.NgZone.run(() => {
        this.router.navigateByUrl('/');
      });
    });
  }

  login() {
    this.usuarioSvc.login(this.loginForm.value).subscribe(
      (resp) => {
        if (this.loginForm.get('remember')?.value) {
          localStorage.setItem('email', this.loginForm.get('email')?.value);
        } else {
          localStorage.removeItem('email');
        }
        this.NgZone.run(() => {
          this.router.navigateByUrl('/');
        });
      },
      (err) => {
        console.log(err);

        Swal.fire('Error', err.error.msg, 'error');
      }
    );

    //console.log(this.loginForm.value);
  }
}
