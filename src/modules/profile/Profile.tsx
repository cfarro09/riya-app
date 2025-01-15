import { FC } from 'react'
import { IonHeader, IonTitle, IonToolbar, IonPage, IonContent } from '@ionic/react';
import { IonButton } from '@ionic/react';
import { useAuth } from '../../store/AuthProvider';

const ProfilePage: FC = () => {
    const { logout } = useAuth()

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Profile</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className="app">
                    <IonButton onClick={logout}>
                        Logout
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    )
}

export { ProfilePage }
