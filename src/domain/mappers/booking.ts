import { map } from 'ionicons/icons'
import {Booking, BookingRequest, BookingResponse} from '../booking'
import { mapActivityResponseToActivity } from './activity'
import { mapSchedulesResponseToSchedules } from './schedule'
import { mapPersonsResponseToPersons } from './person'
import { mapAgeResponseToAge } from './age'
import { mapLevelResponseToLevel } from './level'
import { mapPriceResponseToPrice } from './price'
import { mapUserResponseToUser } from './user'
import { StrapiCollectionResponse, StrapiResponse } from '../response'

export function mapToBookingRequest(booking: Booking): BookingRequest {
  // TODO: Implement the mapping logic here
  const bookingRequest: BookingRequest = {
    // Map the properties from the booking object to the booking request object
    activity: booking.activity.id ?? 0,
    schedulesSelected: booking.schedulesSelected.map((schedule) => schedule.id),
    persons: booking.persons,
    level: booking?.level?.id,
    age: booking?.age?.id,
    startDate: booking.startDate,
    price: booking.price.id,
    creator: booking.creator.id ?? 0,
  }

  return bookingRequest
}

export function mapBookingResponseToBooking({ id, attributes }: StrapiResponse<BookingResponse>): Booking {
    // TODO: Implement the mapping logic here
    const booking: Booking = {
        // Map the properties from the booking response to the booking object
        id,
        activity: mapActivityResponseToActivity(attributes.activity.data!),
        schedulesSelected: mapSchedulesResponseToSchedules(attributes.schedulesSelected),
        persons: mapPersonsResponseToPersons(attributes?.persons ?? []),
        level: mapLevelResponseToLevel(attributes.level!),
        age: mapAgeResponseToAge(attributes.age!),
        startDate: new Date(attributes.startDate),
        price: mapPriceResponseToPrice(attributes.price.data!),
        creator: mapUserResponseToUser(attributes.creator!),
    }

    return booking
}

export function mapBookingsResponseToBookings(activities: StrapiCollectionResponse<BookingResponse>): Partial<Booking>[] {
  return activities.data.map(activityResponse => mapBookingResponseToBooking(activityResponse));
}
