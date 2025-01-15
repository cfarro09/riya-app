import {IonSelect, IonSelectOption} from '@ionic/react'

interface BaseType {
  id: number
  name: string
}

interface SelectorProps<T> {
  items: T[]
  selected: T | undefined
  onChange: (item: T | undefined) => void
  className?: string
  placeholder?: string
  label?: string
}

export function Selector<T extends BaseType>({
  items,
  selected,
  onChange,
  className,
  placeholder,
  label,
}: SelectorProps<T>) {
  return (
    <IonSelect
      mode='md'
      interface='action-sheet'
      labelPlacement='floating'
      fill='outline'
      label={label}
      value={selected?.id}
      className={className}
      placeholder={placeholder}
      onIonChange={(event: CustomEvent) => {
        const value = event?.detail?.value as number
        const item: T | undefined = items.find((n) => n.id === value);
        onChange(item);
      }}
    >
      {items.map((item, index) => (
        <IonSelectOption key={index} value={item?.id}>
          {item?.name}
        </IonSelectOption>
      ))}
    </IonSelect>
  )
}
export default Selector
