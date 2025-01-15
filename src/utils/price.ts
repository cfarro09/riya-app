import {DBStatus} from '../domain/db-status'
import {Price} from '../domain/price'
import {Schedule} from '../domain/schedule'
import {isThereAScheduleOnThisWeekDay} from './time'

export function isTherePrice(prices: Price[], config: Partial<Price>) {
  return prices.some((price) => {
    if (config.age && price.age && price.age.id !== config.age.id) return false
    if (config.level && price.level && price.level.id !== config.level.id) return false
    if (config.numberOfClasses && price.numberOfClasses !== config.numberOfClasses) return false
    if (price.saved === DBStatus.TOBEDELETED) return false
    return true
  })
}

export function getPrice(prices: Price[], config: Partial<Price>) {
  return prices.find((price) => {
    const isAge = config.age && price.age ? price.age.id === config.age.id : true
    const isLevel = config.level && price.level ? price.level.id === config.level.id : true
    const isPricePackage = config.pricePackage
      ? price.pricePackage?.id === config.pricePackage.id
      : true
    const isNumberOfClasses = config.numberOfClasses
      ? price.numberOfClasses === config.numberOfClasses
      : true
    const isNotDeleted = price.saved !== DBStatus.TOBEDELETED
    return isAge && isLevel && isPricePackage && isNumberOfClasses && isNotDeleted
  })
}

export function getAllPricesByConfig(prices: Price[], config: Partial<Price>) {
  return prices.filter((price) => {
    const isAge = config.age && price.age ? price.age.id === config.age.id : true
    const isLevel = config.level && price.level ? price.level.id === config.level.id : true
    const isPricePackage = config.pricePackage
      ? price.pricePackage?.id === config.pricePackage.id
      : true
    const isNumberOfClasses = config.numberOfClasses
      ? price.numberOfClasses === config.numberOfClasses
      : true
    return isAge && isLevel && isPricePackage && isNumberOfClasses
  })
}

export function addingGetPrice(prices: Price[], config: Partial<Price>) {
  return prices.find((price) => {
    const isAge = config.age && price.age ? price.age.id === config.age.id : true
    const isLevel = config.level && price.level ? price.level.id === config.level.id : true
    const isPricePackage = config.pricePackage
      ? price.pricePackage?.id === config.pricePackage.id
      : true
    const isNumberOfClasses = config.numberOfClasses
      ? price.numberOfClasses === config.numberOfClasses
      : true
    return isAge && isLevel && isPricePackage && isNumberOfClasses
  })
}

export const getTotalNumberOfClasses = (price: Price, selectedSchedules: Schedule[]) => {
  const multipliedNumberOfClasses =
    (selectedSchedules?.length ?? 0) * (price?.pricePackage?.multiplier ?? 1)
  return multipliedNumberOfClasses === 0 ? selectedSchedules?.length : multipliedNumberOfClasses
}

export const getLastClass = (
  price: Price,
  selectedSchedules: Schedule[],
  startDate: Date | null,
  activityType: 'Clase' | 'Actividad' | null
): string => {
  let counterOfClasses = 1
  const numberOfClasses = getTotalNumberOfClasses(price, selectedSchedules)
  const startCalculationDate: Date = new Date(startDate?.getTime() || 0)
  while (counterOfClasses < numberOfClasses) {
    startCalculationDate.setDate(startCalculationDate.getDate() + 1)
    if (isThereAScheduleOnThisWeekDay(selectedSchedules, startCalculationDate.getDay())) {
      counterOfClasses++
    }
  }
  return activityType === 'Clase'
    ? `Finaliza el: ${startCalculationDate.toLocaleDateString('es-PE')}`
    : `Finaliza a las: ${startCalculationDate.toLocaleDateString('es-PE')}`
}

export const calculateTotalPrice = (price: Price, selectedSchedules: Schedule[]) => {
  return price?.numberOfClasses === 1
    ? selectedSchedules.length * price?.value
    : price?.value
}