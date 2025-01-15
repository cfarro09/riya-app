import { FC } from "react";
import { Activity } from "../../../domain/activity";
import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonDatetime, IonItemSliding, IonAvatar, IonItemOptions } from "@ionic/react";

interface ActivityCardProps {
  activity: Partial<Activity>;
  onClick: (activity: Partial<Activity>) => void;
}

export const ActivityCard: FC<ActivityCardProps> = ({ activity, onClick }) => {
  const picture = activity.pictures?.[0].url || 'https://via.placeholder.com/150';

  return (
    <IonCard button onClick={() => {
      onClick(activity)
    }}>
      <img src={picture} alt={activity.name!} />
      <IonCardHeader>
        <IonCardTitle>{activity.name}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList>
          <IonItem>
            <IonAvatar aria-hidden="true" slot="start">
              <img alt="" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
            </IonAvatar>
            <IonLabel>{activity.creator?.name}</IonLabel>
          </IonItem>
        </IonList>
      </IonCardContent>
    </IonCard >
  )
}