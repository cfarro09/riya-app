import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent,
  IonNav,
  IonFooter,
  useIonToast,
  useIonAlert,
  useIonLoading,
} from '@ionic/react'

import { FC, useState } from 'react'
import MultiStepProgressBar, { Step } from '../../../components/MultiStepProgressBar'
import GeneralInformation from './GeneralInformation'
import AdditionalInfo from './AdditionalInfo'
import Sessions from './Sessions'
import Location from './Location'
import { Activity } from '../../../domain/activity'
import { ActivityActions, ActivityForm, useActivityDispatch } from '../../../store/ActivityProvider'
import Prices from './Prices'
import { PriceDefinition } from '../../../domain/price'

interface CreateActivityModalProps {
  onDismiss: (data?: string | null) => void
  activity: Partial<Activity>
  onSave: (activity?: Partial<Activity>, boolean?: boolean) => Promise<void>
}

const CreateActivityModal: FC<CreateActivityModalProps> = ({ onDismiss, onSave, activity }) => {
  const dispatch = useActivityDispatch()
  const [presentToast, dismissToast] = useIonToast()
  const [presentDismissAlert, dismissDismissAlert] = useIonAlert();

  const steps: Step[] = [
    { id: 1, last: false, label: 'General', value: 'general-information' },
    { id: 2, last: false, label: 'Ubicación', value: 'location' },
    { id: 3, last: false, label: 'Info Adicional', value: 'additional' },
    { id: 4, last: false, label: 'Sesiones', value: 'session' },
    { id: 5, last: true, label: 'Precios', value: 'price' },
  ]

  const [step, setStep] = useState<Step>(steps[0])

  const handleStep = (step: Step) => {
    setStep(step)
  }

  const updateActivityForm = (activityForm: Partial<ActivityForm>) => {
    dispatch({
      payload: activityForm,
      type: ActivityActions.SetActivityForm,
    })
  }


  const getContentByStep = () => {
    switch (step.value) {
      case 'general-information':
        return <GeneralInformation update={updateActivityForm} />
      case 'session':
        return <Sessions update={updateActivityForm} />
      case 'additional':
        return <AdditionalInfo update={updateActivityForm} />
      case 'location':
        return <Location update={updateActivityForm} />
      case 'price':
        return <Prices update={updateActivityForm} />
      default:
        return <GeneralInformation update={updateActivityForm} />
    }
  }

  const handleCancel = () => {
    presentDismissAlert({
      header: 'Cancelar',
      message: '¿Estás seguro de que deseas cancelar la creación de la actividad?, Perderás los cambios realizados',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Sí',
          handler: () => {
            onDismiss()
          }
        }
      ]
    });
  }

  const onPublish = () => {

    if (!activity.schedules || activity.schedules.length === 0) {
      presentToast({
        header: 'Error',
        message: 'No puedes publicar una actividad sin horarios. Por favor, agrega al menos un horario antes de publicar.',
        buttons: ['OK']
      });
      return;
    }
    
    if (activity.phonetopay && activity.phonetopay.length !== 9) {
      presentToast({
        header: 'Error',
        message: 'Debe ingresar un número de teléfono válido para publicar la actividad',
        buttons: ['OK']
      });
      return;
    }

    const publishedAt = activity?.publishedAt === null ? new Date() : null;
    const publish = async () => {
      await onSave({ ...activity, publishedAt }, false);
      presentToast({
        message: activity?.publishedAt === null ? 'Actividad Publicada' : 'Actividad Despublicada',
        duration: 1500,
        position: 'top',
      })
    }
    publish();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonButton onClick={() => handleCancel()}>Cancelar</IonButton>
          </IonButtons>
          <IonButtons slot='end'>
            <IonButton
              onClick={() => {
                onSave()
                presentToast({
                  message: 'Actividad guardada',
                  duration: 1500,
                  position: 'top',
                })
              }}
            >
              Guardar
            </IonButton>
          </IonButtons>
          <IonTitle>Crear Actividad</IonTitle>
        </IonToolbar>
        <IonToolbar className='ion-padding-vertical'>
          <MultiStepProgressBar steps={steps} onChangeStep={handleStep} selectedStep={step} />
        </IonToolbar>
      </IonHeader>
      <IonContent>{getContentByStep()}</IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButton style={{'--background': '#F6C745'}} onClick={onPublish} expand='block'>{activity?.publishedAt ? 'Despublicar' : 'Publicar'}</IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  )
}

export default CreateActivityModal
