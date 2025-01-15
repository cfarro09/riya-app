import { FC } from 'react'
import { IonHeader, IonContent, IonToolbar, IonTitle, IonPage, IonText } from '@ionic/react';

const SchedulePage: FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Horario</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <IonText className='ion-text-center'>
          <h5>Aqui veras tu horario muy pronto.</h5>
        </IonText>
      </IonContent>
    </IonPage>
  )
}

export { SchedulePage }
