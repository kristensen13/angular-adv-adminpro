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
import { AuthGoogleService } from 'src/app/services/auth-google.service';

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
    private NgZone: NgZone,
    private googleSvc: AuthGoogleService,
  ) { }

  ngAfterViewInit(): void {
    this.googleInit();
  }

  async googleInit() {
    await this.googleSvc.auth2;
    this.auth2 = this.googleSvc.auth2;
    google.accounts.id.renderButton(
      this.googleBtn.nativeElement,
      { theme: 'outline', size: 'large' }
    );
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
  }

}
