import {IonButton, IonIcon, IonItem, IonList, IonText, useIonAlert} from '@ionic/react'
import {addCircle, trash} from 'ionicons/icons'

interface ItemListManagerProps {
  items: string[]
  label: string
  setItems: (items: string[]) => void
}

const ItemListManager: React.FC<ItemListManagerProps> = ({items, label, setItems}) => {
  const [presentAlert] = useIonAlert()

  const handleAddItem = (item: string) => {
    setItems([...items, item])
  }

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  return (
    <div className='ion-margin-vertical'>
      <IonList>
        <IonItem lines='none' key={'list-label'}>
          <IonText color={''}><h5>{label}</h5></IonText>
          <IonButton
            slot='end'
            size='small'
            onClick={() =>
              presentAlert({
                header: label,
                inputs: [
                  {
                    placeholder: 'Ingresa un nuevo item',
                    type: 'text',
                  },
                ],
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel',
                  },
                  {
                    text: 'OK',
                    role: 'confirm',
                    handler: (a) => {
                      handleAddItem(a[0])
                    },
                  },
                ],
              })
            }
          >
            <IonIcon slot='icon-only' icon={addCircle} size='small'></IonIcon>
          </IonButton>
        </IonItem>
        {items.map((item, index) => (
          <IonItem lines='none' key={`list-item-${index}`}>
            • {item}
            <IonButton style={{'--background': '#F6C745'}} slot='end' size='small' onClick={() => handleRemoveItem(index)}>
              <IonIcon slot='icon-only' icon={trash} size='small'></IonIcon>
            </IonButton>
          </IonItem>
        ))}
      </IonList>
    </div>
  )
}

export default ItemListManager
