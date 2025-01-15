import {IonButton, IonInput, IonText} from '@ionic/react'

import './ModalPrice.css'
import {useGlobalAppState} from '../store/AppProvider'
import {useEffect, useMemo, useRef, useState} from 'react'
import {onNumberInput} from '../utils/input'
import {Level} from '../domain/level'
import {Age} from '../domain/age'
import {Price, PriceDefinition} from '../domain/price'
import {Package} from '../domain/package'
import Selector from './Selector'
import { Activity } from '../domain/activity'

interface ModalPriceProps {
  pricePackage: Package | undefined
  priceDefinition: PriceDefinition
  handlePrices: (price: Partial<Price>) => void
  currentActivity: Partial<Activity>
}

const ModalPrice = ({pricePackage, priceDefinition, handlePrices, currentActivity}: ModalPriceProps) => {
  const justOneDay: boolean = pricePackage?.multiplier === 0
  const {ages, levels} = useGlobalAppState()
  const [ages1, setAges1] = useState<Age[]>([])
  const [levels1, setLevels1] = useState<Level[]>([])

  const [selectedLevel, setSelectedLevel] = useState<Level | undefined>()
  const [selectedAge, setSelectedAge] = useState<Age | undefined>()
  const [numberOfClasses, setNumberOfClasses] = useState<number>(justOneDay ? 1 : 0)
  const [value, setValue] = useState<number>(0)

  const ionInputCantidadEl = useRef<HTMLIonInputElement>(null)

  const showLevel: boolean =
    priceDefinition === PriceDefinition.AMBOS || priceDefinition === PriceDefinition.NIVEL
  const showAge: boolean =
    priceDefinition === PriceDefinition.AMBOS || priceDefinition === PriceDefinition.EDAD

  useEffect(() => {
    if (currentActivity) {
      // const {levels, ages} = currentActivity
      // if (currentActivity.levels) {
      //   setLevels1(currentActivity.levels)
      // }
      setLevels1((currentActivity?.levels || []).length > 0 ? currentActivity.levels : levels)
      setAges1((currentActivity?.ages || []).length > 0 ? currentActivity.ages : ages)
    }
  }, [currentActivity])
  

  const addButtonEnabled = useMemo(() => {
    return (
      (!showLevel || selectedLevel) && (!showAge || selectedAge) && numberOfClasses > 0 && value > 0
    )
  }, [showLevel, selectedLevel, showAge, selectedAge, numberOfClasses, value])

  const handleCantidad = (event: Event) => {
    onNumberInput({
      event,
      inputRef: ionInputCantidadEl,
      setModel: setNumberOfClasses,
    })
  }

  const handlePrecio = (event: Event) => {
    const value = (event.target as HTMLIonInputElement).value as string
    const finalValue: number = value === '' ? 0 : parseFloat(value)
    setValue(finalValue)
  }

  const levelSelector = (
    <Selector<Level>
      items={levels1}
      selected={selectedLevel}
      onChange={(level) => {
        setSelectedLevel(level)
      }}
      label='Nivel'
    />
  )

  const ageSelector = (
    <Selector<Age>
      items={ages1}
      className='ion-margin-top'
      selected={selectedAge}
      onChange={(age) => {
        setSelectedAge(age)
      }}
      label='Grupo Etario'
    />
  )

  return (
    <div className='ion-padding-horizontal ion-padding-bottom'>
      <IonText>
        <h5 className='ion-padding-bottom'>Agrega Precio por {pricePackage?.name}</h5>
      </IonText>
      {showLevel && levelSelector}
      {showAge && ageSelector}
      {!justOneDay && (
        <IonInput
          label='Clases por semana'
          className='ion-margin-top'
          placeholder='Cuantas clases por semana?'
          mode='md'
          type='tel'
          labelPlacement='floating'
          fill='outline'
          value={numberOfClasses}
          onIonInput={handleCantidad}
          ref={ionInputCantidadEl}
        ></IonInput>
      )}
      <IonInput
        label='Precio'
        className='ion-margin-top'
        placeholder='Cuanto va a costar?'
        mode='md'
        type='tel'
        labelPlacement='floating'
        fill='outline'
        value={value}
        onIonInput={handlePrecio}
      ></IonInput>
      <IonButton
        expand='block'
        disabled={!addButtonEnabled}
        className='ion-margin-vertical'
        onClick={() => {
          handlePrices({level: selectedLevel, age: selectedAge, numberOfClasses, value})
        }}
      >
        Agregar
      </IonButton>
    </div>
  )
}

export default ModalPrice
