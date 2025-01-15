import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  IonList,
  IonItem,
  IonAccordionGroup,
  IonAccordion,
  IonLabel,
  IonText,
  IonRadioGroup,
  IonRadio,
  useIonAlert,
  AlertInput,
  IonIcon,
  useIonToast,
  IonTextarea,
} from '@ionic/react'
import { checkmarkOutline } from 'ionicons/icons'
import { useGlobalAppState } from '../../../store/AppProvider'
import { ActivityForm, useActivityAppState } from '../../../store/ActivityProvider'
import { Activity } from '../../../domain/activity'

interface Accordion {
  header: string
  value: string
  ask: string
  inputs?: AlertInput[]
  input?: boolean,
  inputRef?: React.RefObject<HTMLIonTextareaElement> | React.RefObject<HTMLIonInputElement>
  checkName: string,
}

interface Option {
  [name: string]: any[] | string | any
}
interface OptionBoolean {
  [name: string]: boolean | undefined
}

interface AditionalInfoProps {
  update: (activity: Partial<ActivityForm>) => void
}

const TextAdditionalInfo = ({ accordion, optionsCheck, additionalItemsInput, currentActivity, update }) => {
  const [localValue, setLocalValue] = useState(currentActivity.additionalItems || "");
  const [valueinitial, setvalueinitial] = useState(currentActivity.additionalItems || "")

  useEffect(() => {
    if (localValue !== valueinitial) {
      const handler = setTimeout(() => {
        update({ currentActivity: { ...currentActivity, additionalItems: localValue } });
      }, 500); // Ajusta el retraso según sea necesario

      return () => {
        clearTimeout(handler);
      };
    }
  }, [localValue]);

  useEffect(() => {
    setvalueinitial(currentActivity.additionalItems || "")
  }, [currentActivity.additionalItems])
  
  return (
    <>
      {accordion.input && optionsCheck[accordion.checkName] === true && (
        <IonTextarea
          rows={5}
          mode='md'
          ref={additionalItemsInput}
          label='Artículos adicionales'
          labelPlacement='floating'
          fill='outline'
          placeholder='Ejemplo: Traer ropa cómoda y zapatillas deportivas'
          className='ion-margin-vertical'
          value={localValue}
          onIonInput={(event) => {
            console.log("event.target.value", event.target.value);
            setLocalValue(String(event.target.value));
          }}
        />
      )}
    </>
  );
};


const AdditionalInfo: React.FC<AditionalInfoProps> = ({ update }) => {
  const { ages, levels } = useGlobalAppState();
  const { activityForm: { currentActivity } } = useActivityAppState();
  const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null)
  const additionalItemsInput = useRef<HTMLIonTextareaElement>(null);
  const [present, dismiss] = useIonAlert()
  const [presentToast, dismissToast] = useIonToast()
  const [accordionSelectedIndex, setAccordionSelectedIndex] = useState<number>(0);

  
  const [accordions, setAccordions] = useState<Accordion[]>([])
  const [options, setOptions] = useState<Option>({
    levels: currentActivity?.levels?.map(level => level.id) || [],
    ages: currentActivity?.ages?.map(age => age.id) || [],
    additionalItems: currentActivity.additionalItems || ""
  })

  const [optionsCheck, setOptionsCheck] = useState<OptionBoolean>({
    hasAges: currentActivity.ages?.length ? false : true,
    hasLevels: currentActivity.levels?.length ? false : true,
    hasAdditionalItems: currentActivity?.additionalItems !== null ? true : false,
  });

  useEffect(() => {
    console.log("options", options)
    const _ages = options['ages'].map((id: number) => {
      return ages.find((age) => age.id === id);
    }).filter(Boolean);

    const _levels = options['levels'].map((id: number) => {
      return levels.find((level) => level.id === id);
    }).filter(Boolean);

    update({ currentActivity: { ...currentActivity, levels: _levels, ages: _ages } })
    // if (_levels.length !== 0) {
    //   console.log("{ ...currentActivity, levels: _levels }", { ...currentActivity, levels: _levels })
    // }
    // if (_ages.length !== 0) {
    //   update({ currentActivity: { ...currentActivity, ages: _ages } })
    // }
  }, [options])

  const onChange = (e: any, accordion: Accordion, index: number) => {
    const radioValue = e?.target?.value
    const [pickedAccordionValue, optionSelected] = radioValue?.split('-')

    if (optionSelected === 'no') {
      if (accordion?.inputs) {
        const inputWithValues = accordion?.inputs.map((input) => {
          let checked = false
          if (options[pickedAccordionValue] !== undefined) {
            const indexOfSelectedValue = options[pickedAccordionValue].indexOf(
              input?.value
            )
            checked = indexOfSelectedValue !== -1
          }
          return { ...input, checked }
        })
        present({
          backdropDismiss: false,
          header: accordion?.header,
          inputs: inputWithValues,
          buttons: [
            {
              text: 'OK',
              handler: (data) => {
                if (data?.length === 0) {
                  presentToast('Necesitas al menos seleccionar una opción')
                  return false
                }
                dismissToast()
              },
            },
          ],
          onDidDismiss: ({ detail: { data } }) => {
            setOptions({
              ...options,
              [pickedAccordionValue]: data?.values,
            })
            if (index !== accordions.length - 1)
              setAccordionSelectedIndex(index + 1)
            else
              setAccordionSelectedIndex(index)
            setOptionsCheck({
              ...optionsCheck,
              [accordion.checkName]: false,
            })
          },
        })
      } else {
        setOptions({ ...options, [pickedAccordionValue]: index === 2 ? "" : [] })
        if (index !== accordions.length - 1)
          setAccordionSelectedIndex(index + 1)
        else
          setAccordionSelectedIndex(index)
        setOptionsCheck({
          ...optionsCheck,
          [accordion.checkName]: false,
        })
      }
    } else if (optionSelected === 'yes') {
      setOptionsCheck({
        ...optionsCheck,
        [accordion.checkName]: true,
      })
      setOptions({ ...options, [pickedAccordionValue]: [] })
      if (index !== accordions.length - 1)
        setAccordionSelectedIndex(index + 1)
      else
        setAccordionSelectedIndex(index)
    }
  }

  const RadioYesNo = ({ value, onChange, accordion }: { accordion: Accordion, value: string; onChange: (e: any) => void }) => {
    let radioValue = "";
    if (optionsCheck[accordion.checkName] !== undefined)
      radioValue = optionsCheck[accordion.checkName] ? `${value}-yes` : `${value}-no`
    return (
      <IonRadioGroup onClick={onChange} name={`${value}-radio`} value={radioValue}>
        <IonItem>
          <IonRadio mode='md' value={`${value}-yes`}>
            Si
          </IonRadio>
        </IonItem>
        <IonItem>
          <IonRadio mode='md' value={`${value}-no`}>
            No
          </IonRadio>
        </IonItem>
      </IonRadioGroup>
    )
  }

  const gruposEtariosInputs = ages.map((age): AlertInput => {
    return {
      label: `${age.startAge} -  hasta ${age.endAge} años`,
      value: age.id,
      type: 'checkbox',
    }
  })

  const nivelesInputs = levels.map(
    (nivel): AlertInput => ({
      label: `${nivel.name}`,
      value: nivel.id,
      type: 'checkbox',
    })
  )

  useEffect(() => {
    const load = async () => {

      setAccordions([
        {
          header: 'Grupos Etarios',
          ask: 'Esta actividad es adecuada para todas las edades?',
          inputs: gruposEtariosInputs,
          value: 'ages',
          checkName: "hasAges",
        },
        {
          header: 'Niveles',
          ask: 'Esta actividad es adecuada para todos los levels?',
          inputs: nivelesInputs,
          value: 'levels',
          checkName: "hasLevels",
        },
        {
          checkName: "hasAdditionalItems",
          header: 'Adicionales',
          value: 'additionalItems',
          input: true,
          inputRef: additionalItemsInput,
          ask: 'El cliente debe llevar algún artículo, vestimenta o equipo para poder realizar la actividad?',
        },
      ])

    }
    load()
  }, [ages, levels])

  const values: { [key: string]: AlertInput[] } = { ages: gruposEtariosInputs, levels: nivelesInputs };

  return (
    <div className='ion-padding'>
      {accordions && (
        <IonAccordionGroup ref={accordionGroup} value={accordions[accordionSelectedIndex]?.value}>
          {accordions?.map((accordion, index) => (
            <IonAccordion value={accordion.value} key={`${index}-${accordion.value}`}>
              <IonItem slot='header' color='light'>
                <IonLabel>
                  {accordion.header}{' '}
                  {optionsCheck[accordion.value] !== undefined && <IonIcon icon={checkmarkOutline}></IonIcon>}
                </IonLabel>
              </IonItem>
              <div className='ion-padding' slot='content'>
                <IonList lines='none'>
                  <IonItem>
                    <IonText className='ion-vertical-padding'>{accordion.ask}</IonText>
                  </IonItem>
                </IonList>
                <RadioYesNo accordion={accordion} value={accordion.value} onChange={(event) => onChange(event, accordion, index)} />
                {accordion.inputs && optionsCheck[accordion.checkName] === false && (
                  <>
                    <IonText className='ion-vertical-padding'>
                      Seleccionaste:
                    </IonText>
                    <IonList lines='none'>
                      {values[accordion.value].filter(val => options[accordion.value].includes(val.value)).map((val) => (
                        <IonItem>
                          <IonText >
                            {val.label}
                          </IonText>
                        </IonItem>))
                      }
                    </IonList>
                  </>
                )}
                <TextAdditionalInfo
                  accordion={accordion}
                  optionsCheck={optionsCheck}
                  additionalItemsInput={additionalItemsInput}
                  currentActivity={currentActivity}
                  update={update}
                />
                {/* {accordion.input && optionsCheck[accordion.checkName] === true && (
                  <IonTextarea
                    rows={5}
                    mode='md'
                    ref={additionalItemsInput}
                    label='Artículos adicionales'
                    labelPlacement='floating'
                    fill='outline'
                    placeholder='Ejemplo: Traer ropa cómoda y zapatillas deportivas'
                    className='ion-margin-vertical'
                    value={currentActivity.additionalItems || ""}
                    onIonInput={(event) => {
                      console.log("event.target.value", event.target.value)
                      update({ currentActivity: { ...currentActivity, additionalItems: String(event.target.value) } })
                      // setOptions({
                      //   ...options,
                      //   [accordion.value]: String(event.target.value) as string,
                      // })
                    }}
                  />
                )} */}
              </div>
            </IonAccordion>
          ))}
        </IonAccordionGroup>
      )}
    </div>
  )
}

export default AdditionalInfo
