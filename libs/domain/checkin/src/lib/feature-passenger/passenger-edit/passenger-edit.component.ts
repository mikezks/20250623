import { httpResource } from '@angular/common/http';
import { Component, effect, inject, input, numberAttribute } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { initialPassenger, Passenger } from '../../logic-passenger';
import { validatePassengerStatus } from '../../util-validation';
import { JsonPipe } from '@angular/common';


@Component({
  selector: 'app-passenger-edit',
  imports: [
    JsonPipe,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './passenger-edit.component.html'
})
export class PassengerEditComponent {
  protected editForm = inject(NonNullableFormBuilder).group({
    id: [0],
    firstName: [''],
    name: [''],
    bonusMiles: [0],
    passengerStatus: ['', [
      validatePassengerStatus(['A', 'B', 'C'])
    ]]
  });

  readonly id = input(0, { transform: numberAttribute });
  protected readonly passengerResource = httpResource<Passenger>(() => ({
    url: 'https://demo.angulararchitects.io/api/passenger',
    params: { id: this.id() }
  }), { defaultValue: initialPassenger });

  constructor() {
    effect(() => {
      if (this.passengerResource.hasValue()) {
        this.editForm.patchValue(
          this.passengerResource.value()
        );
      } else {
        this.editForm.patchValue({
          ...initialPassenger,
          firstName: 'We are in error state!'
        });
      }
    });
  }

  protected save(): void {
    this.passengerResource.set(
      this.editForm.getRawValue()
    );
    console.log(this.editForm.value);
  }
}
