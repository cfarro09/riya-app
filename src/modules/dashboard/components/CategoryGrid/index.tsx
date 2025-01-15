import { FC, useState } from "react";
import CategoryCard from "../CategoryCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css/effect-coverflow';
import 'swiper/css';
import '@ionic/react/css/ionic-swiper.css';
import "./CategoryGrid.scss"
import { Category } from "../../../../domain/category";

interface CategoriesSliderProps {
    categories: Category[],
    onClickItem: (activity: Category) => void
}

const CategoriesSlider: FC<CategoriesSliderProps> = ({ categories, onClickItem }) => {

    return (
        <Swiper
            className="category-slider"
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={false}
            slidesPerView="auto"
            spaceBetween={5}
            navigation={true}
            pagination={{ clickable: true }}
            modules={[Pagination, Navigation]}
            coverflowEffect={{
                // rotate: 40,
                // stretch: 0,
                // depth: 100,
                // modifier: 1,
                slideShadows: true,
            }}>
            {categories.map((item, index) => (
                <SwiperSlide key={index} className="category-item" onClick={() => {
                    onClickItem(item)
                }} >
                    <CategoryCard category={item} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default CategoriesSlider;