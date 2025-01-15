import {IonSegment, IonSegmentButton, IonText} from '@ionic/react'
import {Activity} from '../../../../domain/activity'
import {
  BookingActions,
  useBookingAppState,
  useBookingDispatch,
} from '../../../../store/BookingProvider'
import {Level} from '../../../../domain/level'
import {Age} from '../../../../domain/age'
import { useMemo } from 'react'

const LevelStep = () => {
  const {booking} = useBookingAppState()
  const {levels, ages} = booking?.activity as Activity
  const level: Level = booking?.level as Level
  const age: Age = booking?.age as Age;
  const dispatch = useBookingDispatch();
  
  const handleChangeAge = (event: CustomEvent) => {
    const ageId = event.detail.value
    const age = ages.find((a) => a.id === parseInt(ageId))
    dispatch({type: BookingActions.SetBooking, payload: {...booking, age}})
  }

  const handleChangeLevel = (event: CustomEvent) => {
    const levelId = event.detail.value
    const level = levels.find((l) => l.id === parseInt(levelId));
    dispatch({type: BookingActions.SetBooking, payload: {...booking, level}})
  }

  const mensaje = useMemo(() => {
    if (levels.length === 0 && ages.length === 0) {
      return "No hay niveles ni edades disponibles"
    }
    if (levels.length === 0) {
      return "No hay niveles disponibles"
    }
    if (ages.length === 0) {
      return "No hay edades disponibles"
    }
    return "";
  }, [levels, ages]);


  return (
    <>
      { mensaje}
      {levels.length > 0 && (
        <>
          <IonText className='ion-text-center'>
            <h4>Seleciona tu nivel</h4>
          </IonText>
          <IonSegment scrollable value={level?.id?.toString()} onIonChange={handleChangeLevel}>
            {levels.map((level) => (
              <IonSegmentButton key={level.id} value={level.id.toString()}>
                <IonText>{level.name}</IonText>
              </IonSegmentButton>
            ))}
          </IonSegment>
        </>
      )}

      {ages.length > 0 && (
        <>
          <IonText className='ion-text-center'>
            <h4>Seleciona la edad</h4>
          </IonText>
          <IonSegment scrollable value={age?.id?.toString()} onIonChange={handleChangeAge}>
            {ages.map((age) => (
              <IonSegmentButton key={age.id} value={age.id.toString()}>
                <IonText>{age.name}</IonText>
              </IonSegmentButton>
            ))}
          </IonSegment>
        </>
      )}
    </>
  )
}

export default LevelStep
