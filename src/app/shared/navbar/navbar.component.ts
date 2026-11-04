import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  menuOpen = false;
  highContrast = false;
  fontScale = 1;

  ngOnInit(): void {
    // Las preferencias se almacenan solo en el navegador de quien visita el sitio.
    try {
      this.highContrast = localStorage.getItem('sf-high-contrast') === 'true';
      this.fontScale = Number(localStorage.getItem('sf-font-scale') || '1');
    } catch { /* Algunos navegadores no permiten almacenamiento. */ }
    if (!Number.isFinite(this.fontScale) || this.fontScale < 0.9 || this.fontScale > 1.3) {
      this.fontScale = 1;
    }
    this.applyPreferences();
  }

  private applyPreferences(): void {
    document.documentElement.style.setProperty('--font-scale', `${Math.round(this.fontScale * 100)}%`);
    document.body.classList.toggle('alto-contraste', this.highContrast);
  }

  adjustFont(direction: number): void {
    this.fontScale = Math.max(0.9, Math.min(1.3, Math.round((this.fontScale + direction * 0.1) * 10) / 10));
    this.applyPreferences();
    try { localStorage.setItem('sf-font-scale', String(this.fontScale)); } catch { /* No disponible. */ }
  }

  toggleContrast(): void {
    this.highContrast = !this.highContrast;
    this.applyPreferences();
    try { localStorage.setItem('sf-high-contrast', String(this.highContrast)); } catch { /* No disponible. */ }
  }

  toggleMenu(): void { this.menuOpen = !this.menuOpen; }
  closeMenu(): void { this.menuOpen = false; }

  @HostListener('document:keydown.escape')
  onEscape(): void { this.closeMenu(); }
}
