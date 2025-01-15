import {IonButton, IonChip, IonDatetime, IonGrid, IonModal, IonRow, IonText} from '@ionic/react'
import {useEffect, useState} from 'react'

import {
  BookingActions,
  useBookingAppState,
  useBookingDispatch,
} from '../../../../store/BookingProvider'
import {Activity} from '../../../../domain/activity'
import {isThereAScheduleOnThisWeekDay} from '../../../../utils/time'
import {Schedule, WeekDay} from '../../../../domain/schedule'

import './ScheduleStep.css'

const ScheduleStep: React.FC = () => {
  const {booking} = useBookingAppState()
  const dispatch = useBookingDispatch()
  const {schedules = [], activityType = null} = booking?.activity as Activity
  const [selectedDate, setSelectedDate] = useState<Date | null>(booking?.startDate ?? null);
  const dateFormatPE = new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const getButtonStartDateString = () => {
    const buttonStartDateStringPrefix = activityType === 'Clase' ? 'Fecha de Inicio:' : 'Fecha:'
    if (selectedDate) {
      return `${buttonStartDateStringPrefix} ${dateFormatPE.format(selectedDate)}`
    }
    return activityType === 'Clase' ? 'Ingrese la fecha de Inicio' : 'Ingrese la fecha';
  }

  const [fechaDeInicioString, setFechaDeInicioString] = useState(getButtonStartDateString())
  const [isStartDateModalOpened, setStartDateModalOpened] = useState(false)
  

  const [selectedSchedules, setSelectedSchedules] = useState<Schedule[]>(
    booking?.schedulesSelected ?? []
  )
  const today: Date = new Date()
  today.setHours(0, 0, 0, 0)

  useEffect(() => {
    dispatch({
      type: BookingActions.SetBooking,
      payload: {...booking, schedulesSelected: selectedSchedules, startDate: selectedDate},
    })
  }, [selectedSchedules, selectedDate])

  const timeFormatPE = new Intl.DateTimeFormat('es-PE', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const handleDateChange = (e: CustomEvent) => {
    setSelectedDate(new Date(e.detail.value));
    const buttonStartDateStringPrefix = activityType === 'Clase' ? `Fecha de Inicio:` : `Fecha:`
    setFechaDeInicioString(`${buttonStartDateStringPrefix} ${dateFormatPE.format(new Date(e.detail.value))}`)
    setStartDateModalOpened(false)
    setSelectedSchedules([])
  }

  const checkDateOnDatePicker = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return (
      date.getTime() >= today.getTime() && isThereAScheduleOnThisWeekDay(schedules, date.getDay())
    )
  }

  const handleScheduleSelection = (schedule: Schedule) => {
    const isSelected = isScheduleSelected(schedule)
    if (activityType === 'Actividad' && selectedSchedules.length > 0) {
      setSelectedSchedules([schedule])
      return
    }
    if (isSelected) {
      setSelectedSchedules(
        selectedSchedules.filter((selectedSchedule) => selectedSchedule !== schedule)
      )
    } else {
      setSelectedSchedules([
        ...selectedSchedules.filter((s) => s?.hour?.getDay() !== schedule.hour?.getDay()),
        schedule,
      ].sort((a: Schedule, b: Schedule) => {
        return new Date(a.hour!).getTime() - new Date(b.hour!).getTime();
      }))
    }
  }

  const isScheduleSelected = (schedule: Schedule) => {
    return selectedSchedules.some((selectedSchedule) => selectedSchedule === schedule)
  }

  const getWeekDaysAvailable = () => {
    const weekDaysOnSchedule: number[] = schedules
      .map((schedule: Schedule) => schedule.hour?.getDay() ?? -1)
      .sort()
    const uniqueWeekDays = Array.from(new Set(weekDaysOnSchedule))
    return uniqueWeekDays.map((weekDay) => {
      const day = WeekDay[weekDay]
      const schedulesForDay = schedules.filter(
        (schedule: Schedule) => schedule.hour?.getDay() === weekDay
      ).sort((a: Schedule, b: Schedule) => {
        return new Date(a.hour!).getTime() - new Date(b.hour!).getTime();
      })
      return (
        <>
          <IonRow className='ion-margin-vertical ion-justify-content-center'>
            <IonText>{day}</IonText>
          </IonRow>
          <IonRow className='ion-justify-content-center'>
            {schedulesForDay.map((schedule: Schedule) => (
              <IonChip
                className='schedule-chip'
                outline={!isScheduleSelected(schedule)}
                onClick={() => handleScheduleSelection(schedule)}
              >
                <IonText>{schedule.hour ? timeFormatPE.format(schedule.hour) : 'N/A'}</IonText>
              </IonChip>
            ))}
          </IonRow>
        </>
      )
    })
  }

  return (
    <>
      <IonButton expand='block' style={{'--background': '#F6C745'}} onClick={() => setStartDateModalOpened(true)}>
        {fechaDeInicioString}
      </IonButton>
      <IonModal
        keepContentsMounted={true}
        isOpen={isStartDateModalOpened}
        backdropDismiss={false}
        id='start-date-modal'
      >
        <IonDatetime
          isDateEnabled={checkDateOnDatePicker}
          firstDayOfWeek={1}
          id='fecha-inicio'
          presentation='date'
          onIonChange={handleDateChange}
        ></IonDatetime>
      </IonModal>
      <IonGrid>{selectedDate && getWeekDaysAvailable()}</IonGrid>
    </>
  )
}

export default ScheduleStep
