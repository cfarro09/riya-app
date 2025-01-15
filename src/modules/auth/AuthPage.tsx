import {IonButton, IonContent, IonIcon, IonImg, IonPage, IonText} from '@ionic/react'
import {bicycle, thumbsUp} from 'ionicons/icons'
import {useAuth0} from '@auth0/auth0-react'
import {Browser} from '@capacitor/browser'
import {App as CapApp} from '@capacitor/app'
import {isPlatform} from '@ionic/react'

import './AuthPage.css'
import {useAuth} from '../../store/AuthProvider'
import {useEffect, useState} from 'react'
import {authUser} from '../../proxy/auth'
import {useHistory} from 'react-router'

const AuthPage: React.FC = () => {
  const {handleRedirectCallback} = useAuth0()
  const history = useHistory()
  const {loginWithRedirect} = useAuth0()
  const [loading, setLoading] = useState(false)
  const {saveAuth, setCurrentUser} = useAuth()
  const {getAccessTokenSilently} = useAuth0()

  const login = async () => {
    await loginWithRedirect({
      async openUrl(url) {
        await Browser.open({
          url,
          windowName: '_self',
        })
      },
    })
  }

  useEffect(() => {
    const load = async () => {
      const token = await getAccessTokenSilently();
      console.log(token);
      const userData = await authUser(token)
      saveAuth({
        jwt: userData.jwt,
      })
      setCurrentUser(userData)
      setLoading(false)
      history.push('/')
    }

    // Handle the 'appUrlOpen' event and call `handleRedirectCallback`
    CapApp.addListener('appUrlOpen', async ({url}) => {
      try {
        setLoading(true)

        if (url.includes('state') && (url.includes('code') || url.includes('error'))) {
          await handleRedirectCallback(url)
        }
        // No-op on Android
        if (!isPlatform('android')) {
          await Browser.close()
        }

        await load()
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })
  }, [handleRedirectCallback])

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className='intro-container'>
          <div className='intro-logo-container'>
            <IonImg alt='Riya Mile Logo' src='/logo.png' />
          </div>
          <div className='intro-button-container'>
            <p className='ion-text-center'>
              Estás listo para una nueva aventura? <br />
              Separa tu milla{' '}
              <IonText>
                <IonIcon icon={bicycle}></IonIcon>
              </IonText>
            </p>
            <IonButton
              mode='ios'
              disabled={loading}
              onClick={login}
              className='ion-padding-top'
              color='warning'
              expand='block'
            >
              {!loading ? 'Comencemos' : 'Cargando...'}{' '}
              <IonIcon slot='end' icon={thumbsUp}></IonIcon>
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export {AuthPage}
