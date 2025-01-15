import {useEffect, useMemo, useState} from 'react'
import {Price, PriceDefinition} from '../domain/price'
import {isTherePrice} from '../utils/price'
import {useGlobalAppState} from '../store/AppProvider'
import {Package} from '../domain/package';

interface PriceTableHeader {
  id: number
  name: string
  type?: 'Age' | 'Level'
}

export const usePriceHeaders = (
  activityType: string,
  priceDefinition: PriceDefinition,
  prices: Price[],
  pricePackage: Package | undefined
) => {
  const {ages, levels} = useGlobalAppState()

  const dia = useMemo<boolean>(
    () => Boolean(pricePackage?.multiplier && pricePackage?.multiplier > 0),
    [pricePackage]
  )
  const semana = useMemo<boolean>(
    () => Boolean(pricePackage?.multiplier && pricePackage?.multiplier > 1),
    [pricePackage]
  )

  const headers: PriceTableHeader[] = useMemo(() => {
    let headers: PriceTableHeader[] = [];
    if (activityType === 'Clase' && prices.length > 0) {
      if (dia) {
        headers = [...headers, {id: 0, name: 'Clases'}]
      }

      if (semana) {
        headers = [...headers, {id: 0, name: 'Paquete'}]
      }

      if (priceDefinition === PriceDefinition.NINGUNO) {
        headers = [...headers, {id: 0, name: 'Precio'}]
      }
    }
    if (priceDefinition === PriceDefinition.EDAD || priceDefinition === PriceDefinition.AMBOS) {
      const filteredAges = ages.filter((age) => isTherePrice(prices, {age}))
      headers = [
        ...headers,
        ...filteredAges.map(({id, name}) => ({id, name, type: 'Age'}) as PriceTableHeader),
      ]
    }
    if (priceDefinition === PriceDefinition.NIVEL) {
      const filteredLevels = levels.filter((level) => isTherePrice(prices, {level}))
      headers = [
        ...headers,
        ...filteredLevels.map(({id, name}) => ({id, name, type: 'Level'}) as PriceTableHeader),
      ]
    }
    return headers;
  }, [activityType, priceDefinition, prices])

  return {headers, dia, semana}
}
