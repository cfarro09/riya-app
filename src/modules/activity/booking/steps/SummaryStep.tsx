import React from 'react'
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonGrid,
  IonRow,
  IonText,
  IonCol,
} from '@ionic/react'
import {useBookingAppState} from '../../../../store/BookingProvider'
import './SummaryStep.css'
import {get} from 'immer/dist/internal'
import {getLastClass} from '../../../../utils/price'
import {Price} from '../../../../domain/price'
import {Schedule} from '../../../../domain/schedule'

const SummaryStep: React.FC = () => {
  const {booking} = useBookingAppState()
  const activity = booking?.activity
  const selectedSchedules = booking?.schedulesSelected || []
  const startDate = booking?.startDate || new Date()
  const selectedPrice = booking?.price

  const timeFormatPE = new Intl.DateTimeFormat('es-PE', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  const getTotalPrice = () => {
    if (!selectedPrice) return 0
    return selectedPrice?.numberOfClasses === 1
      ? selectedSchedules.length * selectedPrice?.value
      : selectedPrice?.value
  }

  return (
    <IonCard className='booking-summary-card'>
      <IonCardHeader>
        <IonCardTitle>Resumen de reserva</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid>
          {/* Detalles de la Actividad */}
          <IonRow>
            <IonCol size='12'>
              <IonText className='summary-label'>
                <strong>Actividad:</strong>
              </IonText>
              <IonText className='summary-value'>{activity?.name || 'No especificado'}</IonText>
            </IonCol>
          </IonRow>

          {/* Detalles del Nivel y Edad */}
          <IonRow>
            <IonCol size='12'>
              <IonText className='summary-label'>
                <strong>Nivel:</strong>
              </IonText>
              <IonText className='summary-value'>
                {booking?.level?.name || 'No especificado'}
              </IonText>
            </IonCol>
            <IonCol size='12'>
              <IonText className='summary-label'>
                <strong>Edad:</strong>
              </IonText>
              <IonText className='summary-value'>
                {`${booking?.age?.startAge} - ${booking?.age?.endAge} años` || 'No especificado'}
              </IonText>
            </IonCol>
          </IonRow>

          {/* Detalles de Horarios */}
          <IonRow>
            <IonCol size='12'>
              <IonText className='summary-label'>
                <strong>Horarios Seleccionados:</strong>
              </IonText>
            </IonCol>
            <IonCol size='12'>
              <div className='schedules-container'>
                {selectedSchedules.map((schedule, index) => (
                  <IonChip key={index} className='schedule-chip'>
                    <IonText className='schedule-day'>
                      {schedule?.hour?.toLocaleDateString('es-PE', {weekday: 'long'})}
                    </IonText>
                    <IonText className='schedule-time'>
                      {timeFormatPE.format(schedule.hour!)}
                    </IonText>
                  </IonChip>
                ))}
              </div>
            </IonCol>
          </IonRow>

          {/* Detalles de la Fecha de Inicio */}
          <IonRow>
            <IonCol size='12'>
              <IonText className='summary-label'>
                <strong>Fecha de Inicio:</strong>
              </IonText>
              <IonText className='summary-value'>{startDate.toLocaleDateString('es-PE')}</IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size='12'>
              <IonText className='summary-label'>
                <strong>Fecha de Fin:</strong>
              </IonText>
              <IonText className='summary-value'>
                {getLastClass(
                  booking?.price as Price,
                  booking?.schedulesSelected as Schedule[],
                  startDate,
                  booking?.activity?.activityType as 'Clase' | 'Actividad' | null
                )}
              </IonText>
            </IonCol>
          </IonRow>

          {/* Detalles del Precio */}
          <IonRow>
            <IonCol size='12'>
              <IonText className='summary-label'>
                <strong>Precio Total:</strong>
              </IonText>
              <IonText className='summary-value'>S/. {getTotalPrice()}</IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  )
}

export default SummaryStep
