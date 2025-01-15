import { FC } from 'react'
import "./Settings.css";
import { IonButton, IonHeader, IonContent, IonNavLink, IonToolbar, IonTitle, IonPage, IonItem, IonLabel, IonList, IonImg, IonText } from '@ionic/react';
import { useAuth } from '../../store/AuthProvider';
import { useHistory } from 'react-router';
import { IonIcon } from '@ionic/react';
import { star, starOutline } from 'ionicons/icons';

interface StarRatingProps {
  rating: number; // El rating a mostrar, un número entre 1 y 5
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((index) => (
        <IonIcon
          key={index}
          icon={index <= rating ? star : starOutline}
          style={{ color: '#FFD700', fontSize: '24px', marginRight: '5px' }}
        />
      ))}
    </div>
  );
};

const SettingsPage: FC = () => {
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ajustes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <IonImg className='settings-user-photo' src={currentUser?.picture?.url || "userdefault.png"} alt='Profile Image' />
        <IonText>
          <h2>{currentUser?.name}</h2>
          <h2>{currentUser?.type}</h2>
        </IonText>
        <StarRating rating={currentUser?.avgRating || 0} /> 
        <IonButton expand="block" color="light" onClick={() => history.push("/tabs/settings/profile")}>
          Editar Perfil
        </IonButton>
        <IonList>
          <IonButton expand="block" color="danger" onClick={() => {
            logout();
          }}>
            Logout
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export { SettingsPage }
