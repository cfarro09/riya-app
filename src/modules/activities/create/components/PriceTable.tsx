import { useMemo, useState } from 'react'
import { Level } from '../../../../domain/level'
import { Price, PriceDefinition } from '../../../../domain/price'
import { useGlobalAppState } from '../../../../store/AppProvider'
import { getPrice, isTherePrice } from '../../../../utils/price'
import { ActivityActions, useActivityAppState, useActivityDispatch } from '../../../../store/ActivityProvider'
import { IonAlert, IonCol, IonRow, IonText, useIonAlert } from '@ionic/react'
import { usePriceHeaders } from '../../../../hooks/usePriceHeaders'
import { Package } from '../../../../domain/package'
import './PriceTable.css'
import { DBStatus } from '../../../../domain/db-status'
import { is } from 'immer/dist/internal'

interface PriceTableProps {
  prices: Price[]
  level?: Level
  priceDefinition: PriceDefinition
  pricePackage: Package | undefined
}

const PriceTable: React.FC<PriceTableProps> = ({ prices, level, priceDefinition, pricePackage }) => {
  const { ages, levels } = useGlobalAppState()
  const { activityForm: { currentActivity } } = useActivityAppState();
  const dispatch = useActivityDispatch()
  const [presentAlert, dismissAlert] = useIonAlert()
  const [isAlertRemoveOpen, setIsAlertRemoveOpen] = useState(false);
  const [priceToBeDeleted, setPriceToBeDeleted] = useState<Price>();

  const selectedPrices = useMemo(() => {
    if (priceDefinition === PriceDefinition.AMBOS)
      return prices.filter((price) => price?.level?.id === level?.id)
    return prices
  }, [prices])

  const { headers, dia, semana } = usePriceHeaders(
    currentActivity?.activityType ?? '',
    priceDefinition,
    prices,
    pricePackage
  )

  if (
    priceDefinition === PriceDefinition.NINGUNO &&
    currentActivity?.activityType === 'Actividad'
  ) {
    return (
      <>
        {selectedPrices.map((p) => (
          <IonRow><IonText>Precio de la Actividad: S/. {p?.value}</IonText></IonRow>
        ))}
      </>
    )
  }

  const handleRemovePrice = (price: Price | undefined) => {
    if (!price) return;

    const pricesWithoutPrice = currentActivity?.prices?.filter(p => p.id !== price.id) ?? [];
    if (price.saved === DBStatus.NEW) {
      dispatch({
        type: ActivityActions.SetActivityForm,
        payload: {
          currentActivity: {
            ...currentActivity,
            prices: pricesWithoutPrice,
          },
        },
      });
    } else if (price.saved === DBStatus.SAVED) {
      dispatch({
        type: ActivityActions.SetActivityForm,
        payload: {
          currentActivity: {
            ...currentActivity,
            prices: [...pricesWithoutPrice, { ...price, saved: DBStatus.TOBEDELETED }],
          }
        },
      });
    }
    setIsAlertRemoveOpen(false);
  }


  const handleOpenDeleteAlert = (price: Price) => {
    setPriceToBeDeleted(price);
    setIsAlertRemoveOpen(true);
  }

  const getPriceCell = (prices: Price[], config: Partial<Price>) => {
    const price = getPrice(prices, config);
    if (!price) return <td></td>;

    const validPrice = price?.saved !== DBStatus.TOBEDELETED;
    // return <td key={price.id}><IonText>{config.age?.name} {price?.value}</IonText></td>
    if (validPrice)
      return <td key={price.id}><IonText onClick={() => handleOpenDeleteAlert(price)}>S/. {price?.value}</IonText></td>
    else
      return <td></td>
  }

  const getNumberOfClassesCell = (prices: Price[], config: Partial<Price>, index: number, headers: any) => {
    const price = isTherePrice(prices, config);
    if (!price || (!dia && !semana)) return null;
    let key = "";
    key = dia ? `clases-${index}` : "";
    key = semana ? `paquete-${index}` : "";
    let finalNumberOfClasses = 0;
    finalNumberOfClasses = dia ? config?.numberOfClasses ?? 0 : 0;
    finalNumberOfClasses = semana ? (config?.numberOfClasses ?? 0) * (pricePackage?.multiplier ?? 0) : 0;
    if (price)
      return (
        <>
          <td key={key}>{config?.numberOfClasses}</td>
          {headers.some(x => x.name === "Paquete") && <td key={'paquetea'+index}>{finalNumberOfClasses}</td>}
        </>
      )
    else
      return <td></td>
  }

  const getNumberOfClassesCellPackage = (prices: Price[], config: Partial<Price>, index: number) => {
    const price = isTherePrice(prices, config);
    if (!price || (!dia && !semana)) return null;
    let key = "";
    key = dia ? `clases-${index}` : "";
    key = semana ? `paquete-${index}` : "";
    let finalNumberOfClasses = 0;
    finalNumberOfClasses = dia ? config?.numberOfClasses ?? 0 : 0;
    finalNumberOfClasses = semana ? (config?.numberOfClasses ?? 0) * (pricePackage?.multiplier ?? 0) : 0;
    if (price)
      return <td key={key}>{finalNumberOfClasses}</td>
    else
      return <td></td>
  }


  //Get different values of numberOfClasses from an array of prices
  const uniqueNumberOfClasses = useMemo(() => {
    const numberOfClasses = selectedPrices.map((p) => p.numberOfClasses)
    return Array.from(new Set(numberOfClasses))
  }, [selectedPrices])

  console.log('pricePackage', pricePackage)
  console.log('headers', headers)

  return (
    <div className='price-table'>
      <IonAlert
        header='Está seguro de que desea eliminar este precio?'
        isOpen={isAlertRemoveOpen}
        onAbort={() => setIsAlertRemoveOpen(false)}
        buttons={[
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              setIsAlertRemoveOpen(false)
            },
          },
          {
            text: 'Sí',
            role: 'confirm',
            handler: () => {
              handleRemovePrice(priceToBeDeleted)
            },
          },
        ]}
      ></IonAlert>
      {priceDefinition === PriceDefinition.AMBOS && (
        <IonRow>
          <IonCol>Nivel: {level?.name}</IonCol>
        </IonRow>
      )}
      <table>
        <thead>
          <tr>
            {headers.map((header, headerIndex) => (
              <th key={headerIndex}>{header?.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {uniqueNumberOfClasses.map((numberOfClasses, index) => (
            <tr key={index}>
              {getNumberOfClassesCell(selectedPrices, { numberOfClasses }, index, headers)}
              {/* {headers.some(x => x.name === "Paquete") && getNumberOfClassesCellPackage(selectedPrices, { numberOfClasses }, index)} */}
              {priceDefinition === PriceDefinition.NINGUNO && getPriceCell(selectedPrices, { numberOfClasses })}
              {headers
                .filter((h, i) => h.id !== 0)
                .map((header) => {
                  return getPriceCell(selectedPrices, {
                    age:
                      header.type === 'Age' ? ages.find((age) => age.id === header.id) : undefined,
                    level:
                      header.type === 'Level'
                        ? levels.find((level) => level.id === header.id)
                        : undefined,
                    pricePackage,
                    priceDefinition,
                    numberOfClasses,
                  });
                })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PriceTable
