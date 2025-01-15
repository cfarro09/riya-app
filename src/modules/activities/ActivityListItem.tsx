import {
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
} from '@ionic/react'
import {Activity} from '../../domain/activity'
import {trash} from 'ionicons/icons'

interface ActivityListItemProps {
  activity: Partial<Activity>
  openActivity: (activity: Partial<Activity>) => void
  onDelete: (activity: Partial<Activity>) => void
}

const ActivityListItem: React.FC<ActivityListItemProps> = ({activity, openActivity, onDelete}) => {
  return (
    <IonItemSliding key={activity?.id}>
      <IonItem onClick={() => openActivity(activity)} button={true}>
        <IonLabel>
          <h2>{activity.name}</h2>
        </IonLabel>
      </IonItem>
      <IonItemOptions slot='end'>
        <IonItemOption id='present-alert' onClick={() => onDelete(activity)} color='danger' expandable={true}>
          <IonIcon slot='icon-only' icon={trash}></IonIcon>
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  )
}

export default ActivityListItem;
