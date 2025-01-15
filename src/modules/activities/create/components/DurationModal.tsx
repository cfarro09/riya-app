import {IonButton, IonInput, IonText} from '@ionic/react'
import {useRef, useState} from 'react'
import {onNumberInput} from '../../../../utils/input'

import './DurationModal.css';
import { Duration } from '../../../../domain/duration';


interface DurationModalProps {
  duration: Duration | null; 
  handleDuration: (hours: string, minutes: string) => void
}

const DurationModal: React.FC<DurationModalProps> = ({handleDuration, duration}: DurationModalProps) => {

  const [inputHoursModel, setInputHoursModel] = useState<string>(duration ? duration?.getHours() + '' : '0')
  const [inputMinutesModel, setInputMinutesModel] = useState<string>(duration ? duration?.getMinutes() + '' : '0')
  const ionInputHoursEl = useRef<HTMLIonInputElement>(null)
  const ionInputMinutesEl = useRef<HTMLIonInputElement>(null)

  const handleHours = (event: Event) => {
    onNumberInput({
      event,
      inputRef: ionInputHoursEl,
      setModel: setInputHoursModel,
    })
  }

  const handleMinutes = (event: Event) => {
    onNumberInput({
      event,
      inputRef: ionInputMinutesEl,
      setModel: setInputMinutesModel,
    })
  }

  return (
    <div className='ion-padding-horizontal ion-padding-bottom'>
      <IonText>
        <h5 className='ion-padding-bottom'>Cuanto va a durar tu actividad?</h5>
      </IonText>
      <IonInput
        label='Horas'
        placeholder='Cuantas horas va a durar?'
        mode='md'
        labelPlacement='floating'
        fill='outline'
        value={inputHoursModel}
        onIonInput={handleHours}
        ref={ionInputHoursEl}
      ></IonInput>
      <IonInput
        label='Minutos'
        className='ion-margin-top'
        placeholder='Cuantos minutos va a durar?'
        mode='md'
        labelPlacement='floating'
        fill='outline'
        value={inputMinutesModel}
        onIonInput={handleMinutes}
        ref={ionInputMinutesEl}
      ></IonInput>
      <IonButton expand='block' className='ion-margin-vertical' onClick={() => {
            handleDuration(inputHoursModel, inputMinutesModel)
        }}>
        Asignar duración
      </IonButton>
    </div>
  )
}

export default DurationModal
