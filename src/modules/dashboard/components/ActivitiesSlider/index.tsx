import { FC } from "react";
import ActivityCard from "../ActivityCard";
import { FixedSizeList as List } from 'react-window';
import "./ActivitiesSlider.scss";
import { Activity } from "../../../../domain/activity";

interface ActivitiesSliderProps {
    activities: Activity[];
    onClickItem: (activity: Activity) => void;
}

const ActivitiesSlider: FC<ActivitiesSliderProps> = ({ activities, onClickItem }) => {
    const activitiesWithPrices = activities.filter((activity) => activity.prices.length > 0);
    const publishedActivities = activitiesWithPrices.filter((activity) => activity.publishedAt !== null);

    if (publishedActivities.length === 0) return null;

    return (
        <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
            <List
                height={210} // Puedes ajustar la altura según tus necesidades
                itemCount={publishedActivities.length}
                itemSize={230} // Establece un tamaño fijo aproximado para cada elemento
                layout="horizontal"
                width={window.innerWidth} // Ajustar al ancho de la ventana
            >
                {({ index, style }) => (
                    <div
                        style={{ ...style, display: 'inline-block', marginRight: '10px' }}
                        key={index}
                        onClick={() => onClickItem(publishedActivities[index])}
                    >
                        <ActivityCard activity={publishedActivities[index]} />
                    </div>
                )}
            </List>
        </div>
    );
};

export default ActivitiesSlider;
