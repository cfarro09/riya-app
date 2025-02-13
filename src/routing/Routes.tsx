import { FC, useEffect } from 'react'
import { useAuth } from '../store/AuthProvider'
import { IonRouterOutlet } from '@ionic/react'
import { Redirect, Route, Switch, useHistory } from 'react-router'
import { OnboardingPage } from '../modules/onboarding'
import { TabsRoutes } from './Tabs'
import { AuthPage } from '../modules/auth'
import { getCategories } from '../proxy/categories'
import { AppActions, useGlobalAppDispatch } from '../store/AppProvider'
import { getAges } from '../proxy/ages'
import { getLevels } from '../proxy/levels'
import { getPackages } from '../proxy/packages'
import { getUserMe } from '../proxy/user'
import { getActivities, getMyActivities } from '../proxy/activity'
import { getTrainers } from '../proxy/trainers'
import { ActivityActions, useActivityDispatch } from '../store/ActivityProvider'
import useAllActivities from '../hooks/useAllActivities'
import { train } from 'ionicons/icons'
import { getMyBookings } from '../proxy/booking'

const AppRoutes: FC = () => {
  const { setCurrentUser, currentUser, auth } = useAuth()
  const history = useHistory();
  const dispatchActivity = useActivityDispatch();
  const { loadAllActivities } = useAllActivities();
  const dispatch = useGlobalAppDispatch();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [user, categories, ages, levels, packages, trainers] = await Promise.all([
          getUserMe(),
          getCategories(),
          getAges(),
          getLevels(),
          getPackages(),
          getTrainers(),
        ]);
        user.avgRating = trainers.find(x => x.username === user.username)?.avgRating;
        setCurrentUser(user);
        dispatch({ type: AppActions.SetCategories, payload: (categories || []).sort((a, b) => a?.name.localeCompare(b?.name)) });
        dispatch({ type: AppActions.SetAges, payload: ages || [] });
        dispatch({ type: AppActions.SetLevels, payload: levels || [] });
        dispatch({ type: AppActions.SetPackages, payload: packages || [] });

        const [myActivities, mybookings] = await Promise.all([
          getMyActivities(user.id),
          getMyBookings(user.id),
        ])

        const myTrainers = trainers//.filter(trainer => mybookings.some(act => act.activity?.creator?.id == trainer.id))
        console.log("myActivities", myActivities || [])
        console.log("mybookings", mybookings || [])
        dispatch({ type: AppActions.SetTrainers, payload: myTrainers || [] });
        dispatch({ type: AppActions.SetBookings, payload: mybookings || [] });
        await loadAllActivities();
        dispatchActivity({ type: ActivityActions.SetActivities, payload: myActivities || [] });
      } catch (error) {
        console.error('LOAD DATA ERROR', error)
      }

    };

    if (auth) {
      loadData();
    }
  }, [auth]);

  useEffect(() => {
    if (auth) {
      if (!currentUser?.onboarded) {
        history.push("/onboarding")
      } else {
        history.push("/tabs")
      }
    } else {
      history.push("/login")
    }
  }, [auth, currentUser]) // remove currentUser

  return (
    <IonRouterOutlet id="main">
      {auth ? (
        <Switch>
          <Route path="/onboarding" component={OnboardingPage} exact />
          <Route path="/tabs" component={TabsRoutes} />
          <Redirect from="/" to="/tabs" exact />
        </Switch>) :
        (
          <>
            <Route path="/login" component={AuthPage} exact />
            <Redirect from="/" to="/login" exact />
          </>
        )}
    </IonRouterOutlet>
  );
}

export { AppRoutes }
