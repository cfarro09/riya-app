import { BookingActions, useBookingAppState, useBookingDispatch } from '../../../store/BookingProvider'
import { Schedule } from '../../../domain/schedule'
import { IonItem, IonList, IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';

interface ScheduleSegmentProps {
  schedules: Schedule[]
  selectedDate: Date
  selectedScheduleId: number | undefined
}

const ScheduleSegment: React.FC<ScheduleSegmentProps> = ({
  schedules,
  selectedDate,
  selectedScheduleId,
}) => {
  const { schedule } = useBookingAppState()
  const dispatch = useBookingDispatch()
  const timeFormatPE = new Intl.DateTimeFormat('es-PE', {
    hour: 'numeric',
    minute: 'numeric',
  })

  const handleScheduleChange = (e: CustomEvent) => {
    const scheduleId = e.detail.value
    const schedule = schedules.find((schedule) => schedule.id == scheduleId)
    if (schedule) {
      dispatch({ type: BookingActions.SetSchedule, payload: schedule })
      dispatch({ type: BookingActions.SetDate, payload: selectedDate })
    }
  }

  return (
    <IonList>
      <IonSegment scrollable value={schedule?.id?.toString()} onIonChange={handleScheduleChange}>
        {schedules.map(({ hour, id }) => (
          <IonSegmentButton key={id} value={id.toString()}>
            <IonLabel>{hour && `${timeFormatPE.format(hour)}`}</IonLabel>
          </IonSegmentButton>
        ))}
      </IonSegment>
    </IonList>
  )
}

export default ScheduleSegment
