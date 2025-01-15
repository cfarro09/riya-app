import React from 'react'
import { IonGrid } from '@ionic/react'
import { Price, PriceDefinition } from '../../../../domain/price'
import { Package } from '../../../../domain/package'
import { useGlobalAppState } from '../../../../store/AppProvider'
import PriceTable from './PriceTable'

interface PriceReportProps {
  prices: Price[]
  pricePackage: Package | undefined
  priceDefinition: PriceDefinition | null
}

const PriceReport: React.FC<PriceReportProps> = ({ prices, pricePackage, priceDefinition }) => {

  const selectedPrices = prices.filter(
    (price) =>
      price?.pricePackage?.id === pricePackage?.id && price?.priceDefinition === priceDefinition
  )
  const { levels } = useGlobalAppState()

  if (priceDefinition === null) {
    throw new Error('priceDefinition is  null')
  }

  return (
    <IonGrid>
      {priceDefinition === PriceDefinition.AMBOS &&
        levels.filter((level) => {
          return prices.some((price) => price.level?.id === level.id);
        }).map((level) => (
          <PriceTable key={level.id} prices={selectedPrices} level={level} priceDefinition={priceDefinition} pricePackage={pricePackage} />
        ))
      }
      {priceDefinition !== PriceDefinition.AMBOS && (
        <PriceTable prices={selectedPrices} priceDefinition={priceDefinition} pricePackage={pricePackage} />
      )}
    </IonGrid>
  )
}

export default PriceReport
