import { type } from "@ngrx/signals";
import { eventGroup } from "@ngrx/signals/events";
import { Flight } from "../model/flight";
import { FlightFilter } from "../model/flight-filter";


export const flightEvents = eventGroup({
  source: 'Flight',
  events: {
    flightFilterChanged: type<FlightFilter>(),
    flightsChanged: type<Flight[]>(),
    flightsChangedError: type<{ err: unknown }>(),
    flightDelayTriggered: type<{ id: number; addMin?: number }>(),
    flightsResetTriggered: type<void>(),
    basketChanged: type<{ id: number, selected: boolean }>(),
  }
});
