import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from '@ionic/react'
import {Calendar, Event, momentLocalizer, Navigate, ToolbarProps, Views} from 'react-big-calendar'
import moment from 'moment'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import {arrowBackSharp, arrowForwardSharp, trash} from 'ionicons/icons'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {Duration} from '../../../../domain/duration'
import './CalendarModal.css'
import {Schedule} from '../../../../domain/schedule'
import {mapSchedulesToEventList} from '../../../../domain/mappers/schedule'
import {DBStatus} from '../../../../domain/db-status'
import {useActivityAppState} from '../../../../store/ActivityProvider'

const localizer = momentLocalizer(moment)

const Toolbar: React.FC<ToolbarProps> = ({onNavigate, date}) => {
  const { activityForm: { currentActivity } } = useActivityAppState()
  let startDayCycle: Date | undefined = undefined
  let lastDayCycle: Date | undefined = undefined
  if (date.getDay() === 6 && currentActivity?.activityType === 'Clase') {
    const actualDate = new Date(date)
    actualDate.setDate(actualDate.getDate() - 7)
    startDayCycle = actualDate
  }
  if (date.getDay() === 0 && currentActivity?.activityType === 'Clase') {
    const actualDate = new Date(date)
    actualDate.setDate(actualDate.getDate() + 7)
    lastDayCycle = actualDate
  }

  // const formatOptions: Intl.DateTimeFormatOptions =
  //   currentActivity?.activityType === 'Actividad'
  //     ? {weekday: 'long', day: 'numeric', month: 'long'}
  //     : {weekday: 'long'}

  const formatOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long'
  }

  return (
    <IonToolbar>
      <IonButtons slot='start'>
        <IonButton
          onClick={() => {
            onNavigate(Navigate.PREVIOUS, lastDayCycle)
          }}
        >
          <IonIcon slot='end' icon={arrowBackSharp} />
        </IonButton>
      </IonButtons>
      <IonText className='ion-text-capitalize'>
        {date.toLocaleDateString('es-PE', formatOptions)}
      </IonText>
      <IonButtons slot='end'>
        <IonButton
          onClick={() => {
            onNavigate(Navigate.NEXT, startDayCycle)
          }}
        >
          <IonIcon slot='end' icon={arrowForwardSharp} />
        </IonButton>
      </IonButtons>
    </IonToolbar>
  )
}

interface CalendarModalProps {
  duration: Duration
  activityType: 'Actividad' | 'Clase' | null | undefined
  handleSchedule: (list: Schedule[]) => void
  schedules: Schedule[]
  onDismiss: () => void
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  duration,
  handleSchedule,
  schedules,
  onDismiss,
  activityType,
}) => {
  const [_schedules, setSchedules] = useState<Schedule[]>(schedules)
  const [tempSchedule, setTempSchedule] = useState<Schedule>()
  const [presentRemove] = useIonAlert()

  const eventsList = useMemo<Event[]>(() => {
    const filterSchedules = _schedules.filter(
      (schedule) => schedule?.saved !== DBStatus.TOBEDELETED
    )
    return mapSchedulesToEventList(filterSchedules, duration, activityType)
  }, [_schedules])

  const handleRemove = (id: number) => {
    const scheduleToBeRemoved = _schedules.find((schedule) => schedule?.id !== id)
    let filteredSchedules = _schedules.filter((schedule) => schedule?.id !== id)

    if (scheduleToBeRemoved?.saved === DBStatus.SAVED) {
      filteredSchedules = [
        ...filteredSchedules,
        {...scheduleToBeRemoved, saved: DBStatus.TOBEDELETED},
      ]
    }
    setSchedules(filteredSchedules)
  }

  const onSelecting = useCallback(
    ({start}: {start: Date; end: Date}) => {
      const id = tempSchedule?.id ?? Math.floor(Math.random() * 100)
      let startTime = start.getTime()
      // Prevent reset of tempSchedule if the start time is the same
      if (tempSchedule?.hour?.getTime() !== startTime) {
        setTempSchedule({id, hour: start, saved: DBStatus.NEW})
      }
      return false
    },
    [tempSchedule]
  )

  const onSelect = () => {
    setTempSchedule(undefined)
  }

  useEffect(() => {
    if (tempSchedule) {
      const filteredSchedules = _schedules.filter((schedule) => schedule.id !== tempSchedule?.id)
      setSchedules([...filteredSchedules, {...tempSchedule}])
    }
  }, [tempSchedule])

  const handleRemoveEvent = (event: Event) => {
    const startString = event?.start?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    })
    const endString = event?.end?.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric'})
    presentRemove({
      header: 'Eliminar Horario?',
      subHeader: `${startString} - ${endString}`,
      message: 'Estás seguro que deseas eliminar este horario?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            handleRemove(event?.resource)
          },
        },
      ],
    })
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {/* <IonButtons slot='start'>
            <IonButton onClick={onDismiss}>Cerrar</IonButton>
          </IonButtons> */}
          <IonTitle>Horario</IonTitle>
          <IonButtons slot='end'>
            <IonButton
              onClick={() => {
                handleSchedule(_schedules)
              }}
            >
              Ok
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent onTouchEnd={onSelect}>
        <Calendar
          localizer={localizer}
          startAccessor='start'
          endAccessor='end'
          defaultView={Views.DAY}
          allDayAccessor={() => false}
          events={eventsList}
          onSelectEvent={(event) => handleRemoveEvent(event)}
          components={{
            toolbar: Toolbar,
          }}
          toolbar={true}
          onSelecting={onSelecting}
          selectable
          onSelectSlot={onSelect}
          views={{month: false, week: false, day: true, agenda: false}}
        />
      </IonContent>
    </IonPage>
  )
}

export default CalendarModal
