

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent,
  useIonModal,
  IonProgressBar,
} from '@ionic/react'

import { FC, useEffect, useState } from 'react'
import { Activity } from '../../domain/activity'
import { useGlobalAppState } from '../../store/AppProvider';
import { Category } from '../../domain/category';
import { getActivitiesByCategory } from '../../proxy/activity';
import { ActivityCard } from './components/ActivityCard';
import AcitivtyModal from '../activity/Activity';
import ActivityCardSkeleton from './components/ActivityCardSkeleton';

interface CategoriesAndActivitiesProps {
  onDismiss: (data?: string | null) => void,
  category: Category,
}

const CategoriesAndActivities: FC<CategoriesAndActivitiesProps> = ({ onDismiss, category }) => {
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<Partial<Activity>>();
  const { categories } = useGlobalAppState();
  const [activitiesByCategory, setActivitiesByCategory] = useState<Partial<Activity>[]>([]);

  const [presentActivityModal, dismissActivityModal] = useIonModal(AcitivtyModal, {
    onDismiss: () => dismissActivityModal(),
    activity,
  })


  useEffect(() => {
    (async () => {
      setLoading(true);
      const activities = await getActivitiesByCategory(category.id)
      setLoading(false);
      setActivitiesByCategory(activities)
    })();
  }, [categories])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {loading && <IonProgressBar type="indeterminate"></IonProgressBar>}
          <IonButtons slot='start'>
            <IonButton onClick={() => onDismiss()}>Volver</IonButton>
          </IonButtons>
          <IonTitle>Actividades de {category.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class='ion-padding'>
        <div key={category.id}>
          {
            activitiesByCategory?.map(activity => (
              <ActivityCard
                onClick={() => {
                  setActivity(activity);
                  presentActivityModal();
                }}
                key={activity.id}
                activity={activity}
              />
            ))
          }
          {activitiesByCategory?.length === 0 && !loading && <p>No hay actividades</p>}
          {loading && <ActivityCardSkeleton />}
        </div>
      </IonContent>
    </IonPage>
  )
}

export default CategoriesAndActivities;
