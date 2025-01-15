import React, { useEffect, useState } from 'react'
import {
  IonButton,
  IonIcon,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonCheckbox,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonText,
} from '@ionic/react'
import { imageOutline, remove, star } from 'ionicons/icons'
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera'
import { useGlobalAppState } from '../../../store/AppProvider'
import { ActivityForm, useActivityAppState } from '../../../store/ActivityProvider'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Media } from '../../../domain/media'
import { uploadFile } from '../../../proxy/file'
import ItemListManager from './components/ItemListManager'

const paymentMethods = [
  { "method": "YAPE" },
  { "method": "PLIN" },
]

interface GeneralInformationProps {
  update: (activityForm: Partial<ActivityForm>) => void
}
interface UserPhoto {
  filepath: string
  webviewPath: string | undefined
}

const base64ToBlob = (base64Data: string, contentType: string): Blob => {
  const byteCharacters = atob(base64Data)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: contentType })
}

export async function base64FromPath(path: string): Promise<string> {
  const response = await fetch(path)
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject('method did not return a string')
      }
    }
    reader.readAsDataURL(blob)
  })
}

export function usePhotoGallery() {
  const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
    const base64Data = await base64FromPath(photo.webPath!)
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    })
    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return {
      filepath: fileName,
      webviewPath: savedFile.uri,
    }
  }

  return {
    savePicture,
  }
}

const GeneralInformation: React.FC<GeneralInformationProps> = ({ update }) => {
  const {
    activityForm: { currentActivity },
  } = useActivityAppState()
  const { categories } = useGlobalAppState()
  const [name, setName] = useState(currentActivity.name || '')
  const [phonetopay, setPhonetopay] = useState(currentActivity.phonetopay || '')
  const [paymentMethod, setPaymentMethod] = useState(currentActivity.paymentMethod || '')
  const [category, setCategory] = useState(currentActivity.category)
  const [description, setDescripcion] = useState(currentActivity.description || '')

  const [includedWith, setIncludedWith] = useState<string[]>(currentActivity.includedWith || [])
  const [notAllowedFor, setNotAllowedFor] = useState<string[]>(currentActivity.notAllowedFor || [])

  const [pictures, setPictures] = useState<Media[]>(currentActivity.pictures || [])
  const [mainPictureIndex, setMainPictureIndex] = useState(currentActivity.mainPictureIndex)
  const [hasRights, setHasRights] = useState(currentActivity.hasRights || false)
  const [uploadingFile, setUploadingFile] = useState(false)

  const checkPermissions = async (): Promise<Boolean> => {
    const permissions = await Camera.checkPermissions()
    return permissions?.camera === 'granted' && permissions?.photos === 'granted'
  }

  const captureImage = async () => {
    const permissions = await checkPermissions()

    if (!permissions) {
      await Camera.requestPermissions()
    }

    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
      quality: 50,
      height: 900,
    })

    setUploadingFile(true)

    const blob = base64ToBlob(photo.base64String!, 'image/jpeg')
    const medias = await uploadFile(blob)

    setPictures([...pictures, medias])

    setUploadingFile(false)
  }

  useEffect(() => {
    update({
      currentActivity: {
        ...currentActivity,
        name,
        category,
        description,
        pictures,
        mainPictureIndex,
        hasRights,
        paymentMethod,
        phonetopay,
        includedWith,
        notAllowedFor,
      },
    })
  }, [
    name,
    hasRights,
    paymentMethod,
    phonetopay,
    category,
    pictures,
    description,
    mainPictureIndex,
    notAllowedFor,
    includedWith,
  ])

  return (
    <div className='ion-padding'>
      <IonInput
        mode='md'
        label='Nombre de la actividad'
        labelPlacement='floating'
        fill='outline'
        placeholder='Como se va a llamar tu actividad?'
        className='ion-margin-vertical'
        value={name}
        onIonChange={(event) => setName(event.target.value as string)}
      ></IonInput>
      
      <IonSelect
        mode='md'
        interface='action-sheet'
        label='Tipo de actividad'
        labelPlacement='floating'
        placeholder='Que tipo de actividad vas a crear?'
        fill='outline'
        value={category?.id}
        onIonChange={(event) => {
          const selectedCategoryId = event.detail.value as number
          const selectedCategory = categories.find((category) => category.id === selectedCategoryId)
          setCategory(selectedCategory)
        }}
      >
        {categories.map((category) => (
          <IonSelectOption key={category.id} value={category.id}>
            {category.name}
          </IonSelectOption>
        ))}
      </IonSelect>

      <IonSelect
        mode='md'
        interface='action-sheet'
        label='Modo de pago'
        labelPlacement='floating'
        className='ion-margin-vertical'
        placeholder='Modalidad de pago'
        fill='outline'
        value={currentActivity?.paymentMethod || ""}
        onIonChange={(event) => {
          setPaymentMethod(event.detail.value)
        }}
      >
        {paymentMethods.map((category) => (
          <IonSelectOption key={category.method} value={category.method}>
            {category.method}
          </IonSelectOption>
        ))}
      </IonSelect>


      <IonInput
        mode='md'
        label='Número a pagar'
        labelPlacement='floating'
        fill='outline'
        placeholder='¿A que número se va a yapear o plinear?'
        value={phonetopay}
        onIonChange={(event) => setPhonetopay(event.target.value as string)}
      ></IonInput>
      
      <IonTextarea
        mode='md'
        label='Descripción'
        labelPlacement='floating'
        fill='outline'
        className='ion-margin-vertical'
        placeholder='Ingresa una descripción para tu actividad'
        autoGrow={true}
        value={description}
        onIonChange={(event) => setDescripcion(event.target.value as string)}
      ></IonTextarea>
      <ItemListManager
        label='Que Incluye'
        items={includedWith}
        setItems={(items) => setIncludedWith(items)}
      />
      <ItemListManager
        label='No Apto Para'
        items={notAllowedFor}
        setItems={(items) => setNotAllowedFor(items)}
      />

      <IonButton
        disabled={uploadingFile}
        expand='block'
        style={{'--background': '#F6C745'}}
        onClick={captureImage}
        className='ion-margin-vertical'
      >
        {uploadingFile ? 'Subiendo foto' : 'Agregar Fotos'}
        <IonIcon slot='end' icon={imageOutline}></IonIcon>
      </IonButton>
      <IonGrid>
        <IonRow>
          {pictures.map((photo, index) => (
            <IonCol key={index} size='4'>
              <div className='box-image'>
                <IonImg key={index} src={photo.url}></IonImg>
                <button
                  className='favorite'
                  color='secondary'
                  onClick={() => {
                    setMainPictureIndex(index)
                  }}
                >
                  <IonIcon
                    style={{ color: index === mainPictureIndex ? 'rgb(56, 128, 255)' : 'white' }}
                    icon={star}
                  ></IonIcon>
                </button>
                <button
                  className='remove'
                  color='secondary'
                  onClick={() => {
                    setMainPictureIndex(index)
                    setPictures(pictures.filter((p, i) => i !== index))
                  }}
                >
                  <IonIcon style={{ color: 'black' }} icon={remove}></IonIcon>
                </button>
              </div>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>

      <IonCheckbox
        checked={hasRights}
        onIonChange={(event) => setHasRights(event.target.checked)}
        className='ion-margin-vertical'
      >
        Tengo derechos para usar estas imágenes
      </IonCheckbox>
    </div>
  )
}

export default GeneralInformation
