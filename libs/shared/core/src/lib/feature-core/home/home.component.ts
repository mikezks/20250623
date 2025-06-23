import { Component } from '@angular/core';


@Component({
  selector: 'app-home',
  imports: [],
  template: `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Modern Angular: Reactive Design</h2>
      </div>

      <div class="card-body">
        <ul>
          <li>Signals</li>
          <li>Resource</li>
          <li>RxJS Interop</li>
          <li>Zoneless Synchronization</li>
          <li>Signal Store</li>
          <li>Event API</li>
          <li>... and much more!</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    code {
      color: blue;
    }
  `]
})
export class HomeComponent {
}
