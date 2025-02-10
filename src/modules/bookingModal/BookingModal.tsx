import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
} from '@ionic/react';
import { FC } from 'react';
import { Booking } from '../../domain/booking';
import { getLastClass } from '../../utils/price';
import { ActivityWithBookings } from '../dashboard/components/BookingsSlider';

interface BookingModalProps {
  onDismiss: (data?: string | null) => void;
  booking1: ActivityWithBookings;
}

const timeFormatPE = new Intl.DateTimeFormat('es-PE', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
})


const getTotalPrice = (booking: Booking) => {
  if (!booking.price) return 0
  return (booking.price?.numberOfClasses === 1
    ? booking.schedulesSelected.length * booking.price?.value
    : booking.price?.value) * (booking?.persons.length || 1)
}

const BookingModal: FC<BookingModalProps> = ({ onDismiss, booking1 }) => {


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => onDismiss()}>Volver</IonButton>
          </IonButtons>
          <IonTitle>Mis reservas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding">
          
          {booking1.bookings.map(booking => (
            <IonCard className='booking-summary-card' key={booking.id}>
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
                      <IonText className='summary-value'>{booking.activity?.name || 'No especificado'}</IonText>
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
                        {booking.schedulesSelected.map((schedule, index) => (
                          <IonChip key={index} className='schedule-chip'>
                            <IonText className='schedule-day'>
                              {schedule?.hour?.toLocaleDateString('es-PE', { weekday: 'long' })}
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
                      <IonText className='summary-value'>{booking.startDate.toLocaleDateString('es-PE')}</IonText>
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size='12'>
                      <IonText className='summary-label'>
                        <strong>Fecha de Fin:</strong>
                      </IonText>
                      <IonText className='summary-value'>
                        {getLastClass(
                          booking?.price,
                          booking?.schedulesSelected,
                          booking.startDate,
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
                      <IonText className='summary-value'>S/. {getTotalPrice(booking)}</IonText>
                    </IonCol>
                  </IonRow>

                </IonGrid>
              </IonCardContent>
            </IonCard>
          ))}


        </div>
      </IonContent>
    </IonPage>
  );
};

export default BookingModal;
