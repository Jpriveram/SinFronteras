import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-admin-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  password = '';
  errorMessage = '';

  login(): void {
    this.errorMessage = '';

    const result = this.auth.login(this.password);
    this.password = '';

    if (result === 'invalid-password') {
      this.errorMessage = 'La contraseña es incorrecta.';
    } else if (result === 'storage-unavailable') {
      this.errorMessage = 'No se pudo iniciar la sesión en esta pestaña. Revisa la configuración del navegador.';
    } else {
      void this.router.navigateByUrl('/admin');
    }
  }
}
