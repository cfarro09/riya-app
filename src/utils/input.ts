export const filterNumbers = (value: string) => {
  // Removes non alphanumeric characters
  const filteredValue = value.replace(/[^0-9]+/g, '')

  /**
   * Update both the state variable and
   * the component to keep them in sync.
   */
  return filteredValue
}

export const updateValueInputRef = (
  value: string,
  inputRef: React.RefObject<HTMLIonInputElement>
) => {
  const inputCmp = inputRef.current
  if (inputCmp !== null) {
    inputCmp.value = value
  }
}

interface NumberInputState {
  event: Event
  inputRef: React.RefObject<HTMLIonInputElement>
  setModel: (value: React.SetStateAction<any>) => void
}

export const onNumberInput = ({event, inputRef, setModel}: NumberInputState) => {
  const value = (event.target as HTMLIonInputElement).value as string
  let filteredValue = filterNumbers(value)
  // Without leading zeros
  if (filteredValue !== '') filteredValue = parseInt(filteredValue) + ''
  if(filteredValue !== ''){
    setModel(parseInt(filteredValue))
  }
  updateValueInputRef(filteredValue, inputRef)
}
