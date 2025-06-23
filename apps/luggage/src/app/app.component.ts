import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import LuggageFeatureCheckinComponent from '@flight-demo/luggage/feature-checkin';

@Component({
  imports: [
    RouterModule,
    LuggageFeatureCheckinComponent
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'luggage';
}
