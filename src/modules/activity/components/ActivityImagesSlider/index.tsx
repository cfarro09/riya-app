import { FC } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import '@ionic/react/css/ionic-swiper.css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import "./ActivityImagesSlider.scss"
import { Media } from "../../../../domain/media";
import { Pagination, Navigation, EffectCoverflow } from 'swiper/modules';
import 'swiper/css/effect-coverflow';

interface ActivityImagesSliderProps {
    pictures: Media[]
}

const ActivityImagesSlider: FC<ActivityImagesSliderProps> = ({ pictures }) => {
    return (
        <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            pagination={{
                clickable: true,
            }}
            navigation={true}
            className="activity-images-slider"
            slidesPerView="auto"
            spaceBetween={10}
            modules={[Pagination, Navigation, EffectCoverflow]}
            coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
            }}
        >
            {pictures.map((media, index) => (
                <SwiperSlide key={index} className="activity-images-item">
                    <img className="activity-images-img" src={media.url} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default ActivityImagesSlider;