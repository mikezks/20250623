import { patchState, signalStore, type, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { entityConfig, setAllEntities, updateEntity, withEntities } from '@ngrx/signals/entities';
import { Flight } from '../model/flight';
import { computed, inject } from '@angular/core';
import { FlightFilter } from '../model/flight-filter';
import { FlightService } from '../data-access/flight.service';
import { pipe, switchMap } from 'rxjs';
import { addDelay } from '../../util-flight/add-delay';


export interface BookingState {
  filter: FlightFilter;
  basket: Record<number, boolean>;
}

export const initialBookingState: BookingState = {
  filter: {
    from: 'Hamburg',
    to: 'Graz',
    urgent: false
  },
  basket: {
    3: true,
    5: true,
  }
};

const entityState = {
  entities: {
    5: {
      id: 5,
      from: 'Hamburg',
      to: 'Graz',
      date: new Date().toISOString(),
      delayed: false
    },
    3: {
      id: 3,
      from: 'Hamburg',
      to: 'Graz',
      date: new Date().toISOString(),
      delayed: false
    },
  },
  ids: [3, 5]
}

const flightConfig = entityConfig({
  entity: type<Flight>(),
  collection: 'flight',
  // selectId: flight => flight.id
});


export const BookingStore = signalStore(
  // Provider definition
  { providedIn: 'root' },
  // State
  withState(initialBookingState),
  withEntities(flightConfig),
  // Derived State -> Selectors
  withComputed(store => ({
    delayedFlights: computed(
      () => store.flightEntities().filter(flight => flight.delayed)
    ),
  })),
  /// Updaters
  withMethods(store => ({
    setFilter: (filter: FlightFilter) => patchState(store, { filter }),
    setFlights: (flights: Flight[]) =>
      patchState(store, setAllEntities(flights, flightConfig)),
    updateBasket: (id: number, selected: boolean) => patchState(store, state => ({
      basket: {
        ...state.basket,
        [id]: selected
      }
    })),
    delayFlight: (id: number, addMin = 5) => patchState(store, updateEntity({
      id, changes: flight => addDelay(flight, addMin)
    }, flightConfig))
  })),
  // Side-Effects
  withMethods((
    store,
    flightService = inject(FlightService)
  ) => ({
    loadFlights: rxMethod<FlightFilter>(pipe(
      switchMap(filter => flightService.find(
        filter.from,
        filter.to,
        filter.urgent,
      )),
      tapResponse({
        next: flights => store.setFlights(flights),
        error: err => console.error(err)
      })
    )),
  })),
  withHooks(store => ({
    onInit: () => store.loadFlights(store.filter)
  })),
);