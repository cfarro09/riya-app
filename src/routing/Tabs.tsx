import { FC } from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect, RouteComponentProps, useLocation } from 'react-router';
import { home, settings, statsChartOutline, } from 'ionicons/icons/';
import { DashboardPage } from '../modules/dashboard';
import { SettingsPage, SettingsProfilePage } from '../modules/settings';
import { useUI } from '../store/UIProvider';
import ActivitiesPage from '../modules/activities/ActivitiesPage';
import { SchedulePage } from '../modules/schedule/SchedulePage';
import { useAuth } from '../store/AuthProvider';

const TabsRoutes: FC<RouteComponentProps> = ({ }) => {
  const { showTabs } = useUI();
  const { currentUser } = useAuth();

  let tabBarStyle = showTabs ? undefined : { display: "none" };

  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/tabs/home" component={DashboardPage} exact={true} />
          <Route path="/tabs/activities" component={ActivitiesPage} exact={true} />
          {/* Tabs routes */}
          <Route path="/tabs/schedule" component={SchedulePage} exact={true} />
          <Route path="/tabs/settings" component={SettingsPage} exact={true} />
          <Route path="/tabs/settings/profile" component={SettingsProfilePage} exact={true} />
          {/* End Tabs routes */}
          <Redirect exact path="/tabs" to="/tabs/home" />
        </IonRouterOutlet>
        <IonTabBar slot="bottom" style={tabBarStyle}>
          <IonTabButton tab="home" href="/tabs/home">
            <IonIcon size='small' icon={home} />
            <IonLabel>Dashboard</IonLabel>
          </IonTabButton>
          {(currentUser?.type === "ofertante") &&
            <IonTabButton tab="activities" href="/tabs/activities">
              <IonIcon size='small' icon={statsChartOutline} />
              <IonLabel>Actividades</IonLabel>
            </IonTabButton>
          }

          <IonTabButton tab='settings' href="/tabs/settings">
            <IonIcon size='small' icon={settings} />
            <IonLabel>Ajustes</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  )
}

export { TabsRoutes }
