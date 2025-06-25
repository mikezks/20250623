import { computed, inject } from '@angular/core';
import { mapResponse } from '@ngrx/operators';
import { signalStore, type, withComputed, withState } from '@ngrx/signals';
import { entityConfig, removeAllEntities, setAllEntities, updateEntity, withEntities } from '@ngrx/signals/entities';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { switchMap } from 'rxjs';
import { addDelay } from '../../util-flight/add-delay';
import { FlightService } from '../data-access/flight.service';
import { Flight } from '../model/flight';
import { FlightFilter } from '../model/flight-filter';
import { flightEvents } from './flight.events';


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
  // Updaters: Reducers
  withReducer(
    on(flightEvents.flightFilterChanged, ({ payload: filter }) => ({ filter })),
    on(flightEvents.flightsChanged,
      ({ payload: flights }) => setAllEntities(flights, flightConfig)
    ),
    on(flightEvents.basketChanged, ({ payload: { id, selected } }) => state => ({
      basket: {
        ...state.basket,
        [id]: selected
      }
    })),
    on(flightEvents.flightDelayTriggered, ({ payload: { id, addMin } }) => updateEntity({
      id, changes: flight => addDelay(flight, addMin)
    }, flightConfig)),
    on(flightEvents.flightsResetTriggered, () => removeAllEntities(flightConfig)),
  ),
  // Side-Effects
  withEffects((
    store,
    events = inject(Events),
    flightService = inject(FlightService)
  ) => ({
    loadFlight$: events
      .on(flightEvents.flightFilterChanged)
      .pipe(
        switchMap(({ payload: filter}) => flightService.find(
          filter.from,
          filter.to,
          filter.urgent,
        )),
        mapResponse({
          next: flights => flightEvents.flightsChanged(flights),
          error: err => flightEvents.flightsChangedError({ err })
        })
      ),
  })),
);