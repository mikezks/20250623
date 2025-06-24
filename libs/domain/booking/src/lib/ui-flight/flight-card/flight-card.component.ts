import { DatePipe, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, input, linkedSignal, model, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectCdBlink } from '@flight-demo/shared/core';
import { Flight, initialFlight } from '../../logic-flight';


@Component({
  selector: 'app-flight-card',
  imports: [
    NgStyle, DatePipe,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="card"
      [ngStyle]="{ 'background-color': selectedState() ? 'rgb(204, 197, 185)' : 'white' }"
    >
      <div class="card-header">
        <h2 class="card-title">{{ item().from }} - {{ item().to }}</h2>
      </div>

      <div class="card-body">
        <p>Flight-No.: {{ item().id }}</p>
        <p>Date: {{ item().date | date : "dd.MM.yyyy HH:mm" }}</p>
        <p>
          <button
            (click)="toggleSelection()"
            class="btn btn-info btn-sm"
            style="min-width: 85px; margin-right: 5px"
          >{{ selectedState() ? "Remove" : "Select" }}</button>
          <button
            (click)="emitUpdate()"
            class="btn btn-info btn-sm"
            style="min-width: 85px; margin-right: 5px"
          >Update Parent</button>
          <a
            [routerLink]="['../edit', item().id]"
            class="btn btn-success btn-sm"
            style="min-width: 85px; margin-right: 5px"
          >Edit</a>
          <button
            (click)="delay()"
            class="btn btn-danger btn-sm"
            style="min-width: 85px; margin-right: 5px"
          >Delay</button>
        </p>
      </div>
    </div>

    <!-- {{ blink() }} -->
  `
})
export class FlightCardComponent {
  blink = injectCdBlink();

  readonly item = input.required<Flight>();
  readonly selected = input(false);
  readonly selectedState = linkedSignal({
    source: this.selected,
    computation: source => source
  });
  readonly selectedChange = output<boolean>();
  readonly delayTrigger = output<Flight>();

  toggleSelection(): void {
    this.selectedState.update(curr => !curr);
  }
  
  emitUpdate(): void {
    this.selectedChange.emit(this.selectedState());
  }

  delay(): void {
    this.delayTrigger.emit(this.item());
  }
}
