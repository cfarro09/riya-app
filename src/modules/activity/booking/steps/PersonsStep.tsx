import {IonButton, IonInput} from '@ionic/react'
import {
  BookingActions,
  useBookingAppState,
  useBookingDispatch,
} from '../../../../store/BookingProvider'
import {useAuth} from '../../../../store/AuthProvider'
import {Person} from '../../../../domain/person'
import {FormEvent, useEffect, useState} from 'react'

const PersonsStep = () => {
  const {booking} = useBookingAppState()
  const [persons, setPersons] = useState<Person[]>(booking?.persons as Person[] ?? [])
  const {currentUser} = useAuth()
  const dispatch = useBookingDispatch();

  const handleAddPerson = () => {
    setPersons([
      ...persons,
      {
        name: '',
        dni: '',
        id: 0,
      },
    ])
  }

  useEffect(() => {
    dispatch({type: BookingActions.SetBooking, payload: {...booking, persons}})
  }, [persons])

  const handleNombrePerson = (event: any, index: number) => {
    const name = (event.target as HTMLIonInputElement).value as string;
    setPersons(persons.map((p, i) => (i === index ? {...p, name} : p)))
  }

  const handleDniPerson = (event: any, index: number) => {
    const dni = (event.target as HTMLIonInputElement).value as string
    setPersons(persons.map((p, i) => (i === index ? {...p, dni} : p)))
  }

  return (
    <>
      <IonInput
        className='ion-margin-top'
        mode='md'
        type='tel'
        labelPlacement='floating'
        fill='outline'
        label='Usuario Principal'
        value={currentUser?.name}
        disabled={true}
      ></IonInput>
      <>
        {persons.map((person, index) => (
          <div className='ion-padding-top ion '>
            <IonInput
              key={`name-${index}`}
              className='ion-margin-top'
              placeholder='Ingrese el nombre del participante'
              mode='md'
              type='text'
              label='Nombre'
              labelPlacement='floating'
              fill='outline'
              value={person.name}
              onIonChange={(e) => handleNombrePerson(e, index)}
            ></IonInput>
            <IonInput
              key={`dni-${index}`}
              className='ion-margin-top'
              label='DNI'
              placeholder='Ingrese el DNI del participante'
              mode='md'
              type='tel'
              labelPlacement='floating'
              fill='outline'
              value={person.dni}
              onIonChange={(e) => handleDniPerson(e, index)}
            ></IonInput>
          </div>
        ))}
      </>
      <IonButton expand='block' className='ion-margin-vertical' onClick={() => handleAddPerson()}>
        Agregar más participantes
      </IonButton>
    </>
  )
}

export default PersonsStep
