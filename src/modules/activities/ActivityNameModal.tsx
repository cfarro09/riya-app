import { IonButton, IonInput, IonText } from '@ionic/react'
import { useState } from 'react'

interface ActivityNameModalProps {
  onCreateActivity: (name: string) => void
}

const ActivityNameModal: React.FC<ActivityNameModalProps> = ({ onCreateActivity }) => {
  const [name, setName] = useState<string>("");

  return (
    <div className='ion-padding-horizontal ion-padding-bottom'>
      <IonText>
        <h5 className='ion-padding-bottom'>Cual es el nombre de tu actividad?</h5>
      </IonText>
      <IonInput
        label='Nombre'
        mode='md'
        labelPlacement='floating'
        fill='outline'
        value={name}
        onIonInput={(event) => setName(event.target.value as string)}
      ></IonInput>
      <IonButton expand='block' className='ion-margin-vertical' style={{'--background': '#F6C745'}} onClick={() => {
        if (name.trim() === "")
          return alert("Nombre no valido")
        onCreateActivity(name)
      }}>
        Crear Actividad
      </IonButton>
    </div>
  )
}

export default ActivityNameModal
