import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonSelect,
  IonSelectOption,
  useIonModal,
} from '@ionic/react'
import {listCircle, timeOutline} from 'ionicons/icons'
import React, {useEffect, useState} from 'react'

import DurationModal from './components/DurationModal'
import CalendarModal from './components/CalendarModal'
import {Duration} from '../../../domain/duration'
import {WeekDay, Schedule} from '../../../domain/schedule'
import {getEnumValues} from '../../../utils/object'
import {ActivityForm, useActivityAppState} from '../../../store/ActivityProvider'
import './Sessions.css'

const vacanciesValues = Array.from({length: 100}, (_, index) => index + 1)

const dateTimeFormatPE = new Intl.DateTimeFormat('es-PE', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: false,
  timeZone: 'America/Lima',
})

interface SessionProps {
  update: (activityForm: Partial<ActivityForm>) => void
}

const Sessions: React.FC<SessionProps> = ({update}) => {
  const {
    activityForm: {currentActivity},
  } = useActivityAppState()
  const [activityType, setActivityType] = useState<'Actividad' | 'Clase'>(
    currentActivity?.activityType ?? 'Actividad'
  )
  const [vacancies, setVacancies] = useState(currentActivity.vacancies || 0)
  const [duration, setDuration] = useState<Duration>(currentActivity.duration || new Duration(0))
  const [schedules, setSchedules] = useState<Schedule[]>(
    currentActivity.schedules
      ? currentActivity.schedules.map(({hour, ...props}) => ({
          ...props,
          hour: hour ? new Date(hour) : new Date(),
        }))
      : []
  )

  useEffect(() => {
    update({currentActivity: {...currentActivity, schedules, duration, activityType, vacancies}})
  }, [schedules, duration, activityType, vacancies])

  const handleDuration = (hours: string, minutes: string) => {
    setDuration(new Duration(parseInt(minutes) + parseInt(hours) * 60))
    dismissDurationModal()
  }

  const handleSchedule = (schedules: Schedule[]) => {
    setSchedules(schedules)
    dismissModalSchedule()
  }

  const [presentDurationModal, dismissDurationModal] = useIonModal(DurationModal, {
    duration,
    handleDuration,
  })

  const [presentHorarioModal, dismissModalSchedule] = useIonModal(CalendarModal, {
    handleSchedule,
    duration,
    activityType,
    schedules,
    onDismiss: () => {
      dismissModalSchedule()
    },
  })

  return (
    <div className='ion-padding'>
      <IonSelect
        mode='md'
        interface='alert'
        label='Tipo de sesión'
        labelPlacement='floating'
        placeholder='Que tipo de sesión vas a implementar?'
        fill='outline'
        className='ion-margin-vertical'
        value={activityType}
        onIonChange={(e: CustomEvent) => {
          setActivityType(e?.detail?.value)
        }}
      >
        <IonSelectOption key={1} value={'Actividad'}>
          Actividad
        </IonSelectOption>
        <IonSelectOption key={2} value={'Clase'}>
          Clase
        </IonSelectOption>
      </IonSelect>
      <IonSelect
        mode='md'
        interface='action-sheet'
        label='Vacantes'
        labelPlacement='floating'
        className='ion-margin-vertical'
        placeholder='Cuantas vacantes va a tener tu actividad?'
        fill='outline'
        cancelText='Cancelar'
        value={vacancies}
        onIonChange={(event) => {
          setVacancies(event.detail.value)
        }}
      >
        {vacanciesValues.map((valor, index) => (
          <IonSelectOption key={index} value={valor}>
            {valor}
          </IonSelectOption>
        ))}
      </IonSelect>
      {activityType !== undefined && (
        <IonButton
          expand='block'
          onClick={() => {
            presentDurationModal({id: 'duration-modal'})
          }}
          className='ion-margin-vertical'
        >
          {duration?.isSetted()
            ? `Duración: ${duration?.getHours()} hora(s) y ${duration?.getMinutes()} minuto(s)`
            : `Duración de la ${activityType}`}
          {!duration?.isSetted() && <IonIcon slot='end' icon={timeOutline} />}
        </IonButton>
      )}
      {activityType !== undefined && duration?.isSetted() && (
        <IonButton
          expand='block'
          onClick={() => {
            presentHorarioModal({backdropDismiss: false})
          }}
        >
          Horario
          <IonIcon slot='end' icon={listCircle} />
        </IonButton>
      )}
      <IonGrid>
        {getEnumValues(WeekDay).map((val, index) => {
          const hours: (Date | null)[] = schedules
            .filter((schedule: Schedule) => schedule.hour?.getDay() === val)
            .map((schedules: Schedule) => schedules.hour)

          hours.sort()

          return hours.length > 0 ? (
            <IonRow key={`hour-${index}`}>
              <IonCol key={`hour-${index}-WeekDay`}>
                <sub>{WeekDay[val]}: </sub>
              </IonCol>
              {hours.map((hour, hourIndex) => {
                const endTime = (hour?.getTime() ?? 0) + duration.getTime()
                return (
                  <IonCol key={`hour-${index}-${hourIndex}-${WeekDay[val]}`}>
                    <sub>
                      {hour && dateTimeFormatPE.format(hour)} -{' '}
                      {dateTimeFormatPE.format(new Date(endTime))}
                    </sub>
                  </IonCol>
                )
              })}
            </IonRow>
          ) : null
        })}
      </IonGrid>
    </div>
  )
}

export default Sessions
