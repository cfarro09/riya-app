import { FC, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import '@ionic/react/css/ionic-swiper.css';
import "./BookingSlider.scss"
import BookingCard from "../BookingCard";
import { Booking } from "../../../../domain/booking";
import { Activity } from "../../../../domain/activity";

interface BookingSliderProps {
    bookings: Booking[]
    onClickItem: (booking: ActivityWithBookings) => void

}


export interface ActivityWithBookings extends Activity {
    bookings: Booking[];
}
const BookingsSlider: FC<BookingSliderProps> = ({ bookings, onClickItem }) => {
    const [bookings1, setBookings1] = useState<ActivityWithBookings[]>([])

    useEffect(() => {
        setBookings1(bookings.reduce((result: ActivityWithBookings[], reserva: Booking) => {
            // Buscamos si ya existe la actividad en el resultado acumulado
            let actividadExistente = result.find(
                (item) => item.id === reserva.activity.id
            );

            if (actividadExistente) {
                // Si la actividad ya existe, agregamos la reserva a 'bookings'
                actividadExistente.bookings.push(reserva);
            } else {
                // Si no existe, creamos un nuevo objeto con la actividad y la reserva
                const dd: ActivityWithBookings = {
                    bookings: [reserva],
                    ...(reserva.activity as Activity)
                }
                result.push(dd);
            }

            return result;
        }, []))
    }, [bookings])

    return (
        <Swiper className="booking-slider" slidesPerView="auto" spaceBetween={0}>
            
            {bookings1.map((booking, index) => (
                <SwiperSlide key={index} className="booking-item" onClick={() => onClickItem(booking)}>
                    <BookingCard booking={booking.bookings[0]} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default BookingsSlider;