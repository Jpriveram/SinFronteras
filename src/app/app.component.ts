import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccessibilityReaderComponent } from './shared/accessibility-reader/accessibility-reader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AccessibilityReaderComponent],
  template: '<router-outlet></router-outlet><app-accessibility-reader />'
})
export class AppComponent {}
