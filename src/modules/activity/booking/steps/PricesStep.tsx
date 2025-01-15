import React, { useEffect, useState } from 'react'
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonGrid,
  IonIcon,
  IonRow,
  IonText,
} from '@ionic/react'
import { BookingActions, useBookingAppState, useBookingDispatch } from '../../../../store/BookingProvider'
import { Price } from '../../../../domain/price'
import { Activity } from '../../../../domain/activity'
import { isThereAScheduleOnThisWeekDay } from '../../../../utils/time'
import { calculateTotalPrice, getLastClass, getTotalNumberOfClasses } from '../../../../utils/price'

const PricesStep: React.FC = () => {
  const { booking } = useBookingAppState()
  const { activityType = null } = booking?.activity as Activity
  const selectedSchedules = booking?.schedulesSelected ?? []
  const startDate = booking?.startDate ?? null
  const [selectedPrice, setSelectedPrice] = useState<Price | null>(null)
  const possiblePrices: Price[] =
    booking?.activity?.prices?.filter(
      (price) => ((price.numberOfClasses === selectedSchedules.length || price.numberOfClasses === 1) && (!booking.age || booking.age.id === price?.age?.id) && (!booking.level || booking.level.id === price.level?.id))
    ) || []

  const dispatch = useBookingDispatch();

  useEffect(() => {
    if (!possiblePrices.some((price) => price.id === booking?.price?.id)) {
      dispatch({ type: BookingActions.SetBooking, payload: { ...booking, price: undefined } })
    } else if (booking?.price) {
      setSelectedPrice(booking?.price)
    }
  }, [])

  useEffect(() => {
    dispatch({ type: BookingActions.SetBooking, payload: { ...booking, price: selectedPrice } })
  }, [selectedPrice])

  const timeFormatPE = new Intl.DateTimeFormat('es-PE', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  const getTotalNumberOfClassesString = (price: Price) => {
    const numberOfClasses = selectedSchedules.length * (price?.pricePackage?.multiplier ?? 1);
    const pluralOrSingular: string = numberOfClasses === 1 ? 'clase' : 'clases';
    return `${getTotalNumberOfClasses(price, selectedSchedules)} ${pluralOrSingular}`;
  }

  const handlePriceSelection = (price: Price) => {
    setSelectedPrice(price)
  }

  return (
    <IonGrid>
      <IonRow>
        <IonText className='ion-text-center'>
          <h6>Según {activityType === 'Clase' ? 'los horarios' : 'el horario'} que has seleccionado</h6>
        </IonText>
      </IonRow>
      <IonRow>
        {selectedSchedules.map((schedule) => (
          <IonChip key={schedule.id}>
            {' '}
            <IonText className='ion-text-capitalize'>
              {schedule?.hour?.toLocaleDateString('es-PE', {
                weekday: 'long',
              })}
              : {timeFormatPE.format(schedule.hour!)}
            </IonText>
          </IonChip>
        ))}
      </IonRow>
      <IonRow>
        <IonText className='ion-text-center'>
          <h6>Esto es lo que tenemos para ti</h6>
        </IonText>
      </IonRow>
      {possiblePrices.map((price) => (
        <IonCard key={price.id} button={true} onClick={() => handlePriceSelection(price)} color={selectedPrice === price ? 'primary' : 'light'}>
          <IonCardHeader>
            <IonCardTitle>
              S/. {price.value}
            </IonCardTitle>
            {activityType === 'Clase' && <IonCardSubtitle>Paquete por {price.pricePackage?.name}</IonCardSubtitle>}
          </IonCardHeader>
          <IonCardContent>
            {price.age && <IonText>Edad: {price.age.name}</IonText>}
            {price.age && <br/>}
            {price.level && <IonText>Nivel: {price.level.name}</IonText>}
            {price.level && <br/>}
            {activityType === 'Clase' && <IonText>{getTotalNumberOfClassesString(price)} en los horarios que has escogido</IonText>}
            {activityType === 'Clase' && <br />}
            {activityType === 'Clase' && <IonText color={'primary'}>Total a pagar: S/. {calculateTotalPrice(price, selectedSchedules)}</IonText>}
            {activityType === 'Clase' && <br />}
            {getLastClass(price, selectedSchedules, startDate, activityType)}
          </IonCardContent>

        </IonCard>
      ))}
    </IonGrid>
  )
}

export default PricesStep
