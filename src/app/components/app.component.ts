import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,   // must be true in Angular 21
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  protected readonly title;

  constructor() {
    this.title = signal('angular-upgrade');
  }
}
