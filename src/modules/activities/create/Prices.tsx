import React, {useEffect, useMemo, useState} from 'react'
import {
  IonAlert,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonPopover,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonText,
  useIonModal,
} from '@ionic/react'

import ModalPrice from '../../../components/ModalPrice'
import {addOutline} from 'ionicons/icons'
import {Price, PriceDefinition, PRICE_DEFINITION_LITERALS} from '../../../domain/price'
import {useGlobalAppState} from '../../../store/AppProvider'
import {Package} from '../../../domain/package'
import {ActivityForm, useActivityAppState} from '../../../store/ActivityProvider'
import PriceReport from './components/PriceReport'
import {Activity} from '../../../domain/activity'
import {DBStatus} from '../../../domain/db-status'
import {addingGetPrice} from '../../../utils/price'

interface PricesProps {
  update: (activityForm: Partial<ActivityForm>) => void
}

const Prices: React.FC<PricesProps> = ({update}) => {
  const { activityForm: { currentActivity, priceDefinition, popoverOpened } } = useActivityAppState();
  const loadedPriceDefinition: PriceDefinition | null = (priceDefinition  ?? (currentActivity?.prices ? currentActivity.prices[0]?.priceDefinition : null)) ?? null;
  const [priceDefinitionState, setPriceDefinition] = useState<PriceDefinition | null>(loadedPriceDefinition)
  const {packages} = useGlobalAppState()
  const [prices, setPrices] = useState<Price[]>(currentActivity?.prices || [])
  const [pricePackage, setPricePackage] = useState<Package>({id: 1, name: 'Día', multiplier: 0});  
  
  useEffect(() => {
    update({
      currentActivity: { ...currentActivity, prices },
      priceDefinition: priceDefinitionState
    })
  }, [prices, priceDefinitionState]);

  const handlePrices = ({level, age, numberOfClasses, value}: Partial<Price>) => {
    if (priceDefinition != null) {
      const newPrice: Price = {
        id: 0,
        level,
        age,
        numberOfClasses: numberOfClasses || 1,
        value: value || 0,
        saved: DBStatus.NEW,
        pricePackage,
        priceDefinition,
      }

      const foundPrice = addingGetPrice(prices, newPrice) ?? newPrice
      const filteredPrices = foundPrice ? prices.filter((price) => price !== foundPrice) : prices
      setPrices([...filteredPrices, {...foundPrice, value: value || 0}])
      dismiss()
    }
  }

  // Set the first package as the default one
  useEffect(() => {
    if (packages.length > 0) {
      setPricePackage(packages[0])
    }
  }, [packages])

  const [present, dismiss] = useIonModal(ModalPrice, {
    pricePackage,
    priceDefinition,
    handlePrices,
    currentActivity,
    onDismiss: (e: any) => handleDismiss(e),
  })

  const handleDismiss = (e: any) => {
    dismiss(e)
  }

  return (
    <div className='ion-padding'>
      {priceDefinition === null && (
        <IonSelect
          className='ion-margin-bottom'
          aria-label='fruit'
          fill='outline'
          mode='md'
          label='Diferencia tus precios'
          labelPlacement='floating'
          value={priceDefinition}
          onIonChange={(event: CustomEvent) => {
            const pDValue: PriceDefinition = event?.detail?.value as PriceDefinition
            setPriceDefinition(pDValue);  
          }}
        >
          {Object.keys(PRICE_DEFINITION_LITERALS)
            .map((pDK) => parseInt(pDK, 10))
            .map((pDK: PriceDefinition) => (
              <IonSelectOption value={pDK} key={pDK}>
                {PRICE_DEFINITION_LITERALS[pDK]}
              </IonSelectOption>
            ))}
        </IonSelect>
      )}
      {priceDefinition !== null && (
        <IonItem lines='none'>
          <IonText>
            {priceDefinition === PriceDefinition.NINGUNO
              ? 'Tus precios no tiene ninguna diferenciación'
              : priceDefinition !== null && `Tus precios están definidos ${PRICE_DEFINITION_LITERALS[priceDefinition]?.toLowerCase()}`}
          </IonText>
        </IonItem>
      )}
      {priceDefinition !== null && currentActivity?.activityType === 'Clase' && (
        <IonItem lines='none'>
          <IonSegment
            scrollable={true}
            mode='ios'
            value={pricePackage?.id}
            onIonChange={(event: CustomEvent) => {
              const pricePackageId = event?.detail?.value as number
              const selectedPackage: Package | undefined = packages.find(
                (n) => n.id === pricePackageId
              )
              setPricePackage(selectedPackage ?? {id: 1, name: 'Día', multiplier: 0})
            }}
          >
            {packages.map((p) => (
              <IonSegmentButton value={p.id} key={p?.id}>
                {p.name}
              </IonSegmentButton>
            ))}
          </IonSegment>
        </IonItem>
      )}
      {priceDefinition !== null && (
        <IonFab id='add-prices-button' slot='fixed' vertical='bottom' horizontal='end'>
          <IonFabButton
            onClick={() => {
              present({id: 'modal-price'})
            }}
          >
            <IonIcon icon={addOutline}></IonIcon>
          </IonFabButton>
        </IonFab>
      )}
      {priceDefinition !== null && popoverOpened && (
        <IonPopover
          trigger='add-prices-button'
          isOpen={popoverOpened}
          onDidDismiss={() => update({ popoverOpened: false })}
        >
          <IonContent class='ion-padding'>Ahora añade tus precios</IonContent>
        </IonPopover>
      )}
      {priceDefinition !== null && prices.length > 0 && (
        <IonItem lines='none'>
          <PriceReport
            prices={currentActivity?.prices || []}
            pricePackage={
              currentActivity?.activityType === 'Clase'
                ? pricePackage
                : {id: 1, name: 'Día', multiplier: 0}
            }
            priceDefinition={priceDefinition}
          />
        </IonItem>
      )}
    </div>
  )
}

export default Prices
