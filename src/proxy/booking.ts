import { millaApiUrl } from "../auth.config";
import { Booking, BookingResponse } from "../domain/booking";
import { mapBookingResponseToBooking, mapBookingsResponseToBookings, mapToBookingRequest } from "../domain/mappers/booking";
import { StrapiCollectionResponse } from "../domain/response";
import { getAuth } from "../utils/auth-utils";

export async function createBooking(booking: Booking): Promise<Booking> {
  try {
    const response = await fetch(`${millaApiUrl}/api/bookings/create-booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuth()?.jwt}`,
      },
      body: JSON.stringify(mapToBookingRequest(booking)),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const bookingResponse = await response.json();
    debugger
    // const booking1 = mapBookingResponseToBooking(bookingResponse.data);

    await fetch(`${millaApiUrl}/api/bookings/${bookingResponse.id}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuth()?.jwt}`,
      }
    });

    return booking;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getMyBookings(userId: number): Promise<Partial<Booking>[]> {
  try {
    const response = await fetch(
      `${millaApiUrl}/api/bookings?populate[age][populate]=*&populate[level][populate]=*&populate[activity][populate]=*&populate[schedulesSelected][populate]=*&populate[persons]=*&populate[creator]=*&populate[price]=*&filters[creator][id][$eq]=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuth()?.jwt}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const activityResponse = (await response.json()) as StrapiCollectionResponse<BookingResponse>
    return mapBookingsResponseToBookings(activityResponse)
  } catch (error) {
    throw error
  }
}
