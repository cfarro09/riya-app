import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent,
  IonText,
  IonFooter,
  IonIcon,
} from '@ionic/react';
import { FC, useState } from 'react';
import { star, starOutline, train } from 'ionicons/icons';
import { User } from '../../domain/user';
import { setRatingToTrainner } from '../../proxy/trainers';
import { useAuth } from '../../store/AuthProvider';
import { AppActions, useGlobalAppDispatch, useGlobalAppState } from '../../store/AppProvider';

interface TrainerModalProps {
  onDismiss: (data?: string | null) => void;
  trainer: User;
}

const TrainerModal: FC<TrainerModalProps> = ({ onDismiss, trainer }) => {
  const [rating, setRating] = useState(trainer.userRating || 0);
  const { currentUser } = useAuth();
  const dispatch = useGlobalAppDispatch();
  const { myBookings } = useGlobalAppState();

  const handlerRating = async (rating: number) => {
    setRating(rating);
    dispatch({ type: AppActions.UpdateTrainerRating, payload: { ...trainer, userRating: rating } });
    setRatingToTrainner({
      from_user: currentUser?.id ?? 0,
      admin_user: trainer.id,
      rating
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => onDismiss()}>Volver</IonButton>
          </IonButtons>
          <IonTitle>Entrenador {myBookings.length}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding">
          <IonText>
            <h3 className="text-center">{trainer.name}</h3>
          </IonText>

          <IonText>
            <h4>Deja tu calificación</h4>
            <div>
              {[1, 2, 3, 4, 5].map((index) => (
                <IonIcon
                  key={index}
                  icon={index <= rating ? star : starOutline}
                  style={{ color: '#FFD700', fontSize: '24px', marginRight: '5px' }}
                  onClick={() => handlerRating(index)}
                />
              ))}
            </div>
          </IonText>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TrainerModal;
