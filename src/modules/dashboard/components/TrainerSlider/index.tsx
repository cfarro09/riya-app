import { FC } from "react";
import TrainerCard from "../TrainerCard";
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import '@ionic/react/css/ionic-swiper.css';
import "./TrainerSlider.scss"
import { User } from "../../../../domain/user";

interface TrainerSliderProps {
    trainers: User[]
    onClickItem: (activity: User) => void

}

const TrainerSlider: FC<TrainerSliderProps> = ({ trainers, onClickItem }) => {
    return (
        <Swiper className="trainer-slider" slidesPerView="auto" spaceBetween={0}>
            {trainers.map((trainer, index) => (
                <SwiperSlide key={index} className="trainer-item" onClick={() => onClickItem(trainer)}>
                    <TrainerCard trainer={trainer} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default TrainerSlider;