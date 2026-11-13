import { Injectable } from '@angular/core';

const ADMIN_PASSWORD = 'admin123';
const ADMIN_SESSION_KEY = 'sinfronteras-admin-session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  login(password: string): 'success' | 'invalid-password' | 'storage-unavailable' {
    if (password !== ADMIN_PASSWORD) return 'invalid-password';

    try {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'active');
      return 'success';
    } catch {
      return 'storage-unavailable';
    }
  }

  isAdminAuthenticated(): boolean {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'active';
    } catch {
      return false;
    }
  }

  logout(): void {
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {
      // La aplicación permanece sin sesión si el almacenamiento no está disponible.
    }
  }
}
