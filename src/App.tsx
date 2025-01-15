import { IonApp, setupIonicReact } from '@ionic/react';
import "./App.css"

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { AppRoutes } from './routing/Routes';
import { AuthProvider } from './store/AuthProvider';
import { IonReactRouter } from '@ionic/react-router';
import { UIProvider } from './store/UIProvider';
import { GlobalAppProvider } from './store/AppProvider';
import { ActivityProvider } from './store/ActivityProvider';
import { BookingProvider } from './store/BookingProvider';

setupIonicReact();

const App: React.FC = () => {
  return (
    <AuthProvider>
      <UIProvider>
        <GlobalAppProvider>
          <BookingProvider>
            <IonReactRouter>
              <ActivityProvider>
                <IonApp>
                  <AppRoutes />
                </IonApp>
              </ActivityProvider>
            </IonReactRouter>
          </BookingProvider>
        </GlobalAppProvider>
      </UIProvider>
    </AuthProvider >
  );
}

export default App;
