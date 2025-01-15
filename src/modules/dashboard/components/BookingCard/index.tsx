import { FC } from "react";
import "./BookingCard.scss"
import { IonImg } from '@ionic/react';
import { User } from "../../../../domain/user";
import { Booking } from "../../../../domain/booking";
import trekkingImg from '../../../../assets/img/trekking.jpeg'
import { Activity } from "../../../../domain/activity";
import { useGlobalAppState } from "../../../../store/AppProvider";

interface BookingProps {
    booking: Booking
}

const BookingCard: FC<BookingProps> = ({ booking }) => {
    const { categories } = useGlobalAppState();

    const activity = booking?.activity as Activity;
    const hasPicture = activity?.pictures?.length > 0;

    const hasCategory = activity?.category?.id !== undefined;

    const picture = hasPicture
        ? activity.pictures[0].url
        : hasCategory ? categories.find((c) => c.id === activity.category.id)?.picture?.url ?? trekkingImg : trekkingImg;


    return (
        <div className="booking">
            <img className='activity-image' src={picture} />
            <div className='activity-name'>{activity.name}</div>
            <div className='activity-name'>{activity.category?.name}</div>
        </div>
    );
};

export default BookingCard;