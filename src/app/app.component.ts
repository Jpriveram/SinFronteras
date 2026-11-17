import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccessibilityReaderComponent } from './shared/accessibility-reader/accessibility-reader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AccessibilityReaderComponent],
  template: '<router-outlet></router-outlet><app-accessibility-reader />'
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    try {
      document.body.classList.toggle('alto-contraste', localStorage.getItem('sf-high-contrast') === 'true');
    } catch {
      // The preference remains available for the current page through the navbar toggle.
    }
  }
}
