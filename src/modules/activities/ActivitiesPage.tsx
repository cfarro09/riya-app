import {
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonFab,
  IonFabButton,
  IonIcon,
  useIonModal,
  IonList,
  IonText,
  IonAlert,
  useIonLoading,
} from '@ionic/react'
import {add} from 'ionicons/icons'
import CreateActivityModal from './create/CreateActivityModal'
import {
  ActivityActions,
  useActivityAppState,
  useActivityDispatch,
} from '../../store/ActivityProvider'
import './ActivitiesPage.css'
import {Activity} from '../../domain/activity'
import ActivityNameModal from './ActivityNameModal'
import {ActivityProxy, getActivities, getMyActivities} from '../../proxy/activity'
import {useAuth} from '../../store/AuthProvider'
import {useMemo, useState} from 'react'
import ActivityListItem from './ActivityListItem'
import { AppActions, useGlobalAppDispatch } from '../../store/AppProvider'
import useAllActivities from '../../hooks/useAllActivities'

function ActivitiesPage() {
  const { activityForm: { currentActivity }, activities } = useActivityAppState();
  const {currentUser} = useAuth();
  const { loadAllActivities } = useAllActivities();
  const [presentLoading, dismissLoading] = useIonLoading();

  // dismissLoading();

  const onActivityUpdate = async (activity: Partial<Activity> = currentActivity, noCloseModal: boolean = false) => {
    try {
      presentLoading( { message: 'Actualizando Actividad...' });
      const updatedActivity = await ActivityProxy.updateActivity(activity, currentUser!.id!)
      dispatch({
        payload: updatedActivity,
        type: ActivityActions.SetCurrentActivity,
      })
      await loadMyActivities();
      await loadAllActivities();
      if (!noCloseModal) {
        handleCreateActivityModalDismiss();
      }
      dismissLoading();
    } catch (error) {
      console.error(error)
    }
  }

  const [present, dismiss] = useIonModal(CreateActivityModal, {
    onDismiss: (e: any) => handleCreateActivityModalDismiss(),
    activity: currentActivity,
    onSave: onActivityUpdate,
  })
  const [presentActivityNameModal, dismisActivityNameModal] = useIonModal(ActivityNameModal, {
    onCreateActivity: (name: string) => handleOnCreateActivity(name),
  })
  const dispatch = useActivityDispatch()
  const appDispatch = useGlobalAppDispatch()

  const [activityToBeDeletedId, setActivityToBeDeletedId] = useState(0)
  const [isAlertRemoveOpen, setIsAlertRemoveOpen] = useState(false)

  const loadMyActivities = async () => {
    const activities = await getActivities();
    if (currentUser) {
      const userActivities = await getMyActivities(currentUser.id!);
      dispatch({type: ActivityActions.SetActivities, payload: userActivities})
    }
    appDispatch({type: AppActions.SetActivities, payload: activities})
  }

  const handleOnCreateActivity = async (name: string) => {
    try {
      presentLoading( { message: 'Creando Actividad...' });
      const activity = await ActivityProxy.createActivity(name,  currentUser!.id!)
      dismisActivityNameModal()
      openActivity(activity)
      loadMyActivities()
      dismissLoading();
    } catch (error) {
      console.error(error)
    }
  }

  const handleCreateActivityModalDismiss = () => {
    dismiss()
    dispatch({
      type: ActivityActions.ClearForm,
      payload: {},
    })
  }

  const openActivity = (activity: Partial<Activity>) => {
    dispatch({
      type: ActivityActions.SetCurrentActivity,
      payload: activity,
    })
    present({backdropDismiss: false})
  }

  const handleOpenDeleteAlert = (activity: Partial<Activity>) => {
    setActivityToBeDeletedId(activity.id!)
    setIsAlertRemoveOpen(true)
  }

  const handleDelete = async (activityToBeDeletedId: number) => {
    try {
      await ActivityProxy.removeActivity(activityToBeDeletedId)
      await loadMyActivities()
    } catch (error) {
      console.error(error)
    } finally {
      setIsAlertRemoveOpen(false)
    }
  }

  const {publishedActivities, unpublishedActivities} = useMemo(() => {
    const publishedActivities = activities.filter((activity) => activity.publishedAt !== null)
    const unpublishedActivities = activities.filter((activity) => activity.publishedAt === null)
    return {publishedActivities, unpublishedActivities}
  }, [activities]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Actividades</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class='ion-padding'>
        {unpublishedActivities?.length !== 0 && <IonText>
          <h4>Actividades no publicadas</h4>
        </IonText>}
        <IonList>
          {unpublishedActivities.map((activity) => (
            <ActivityListItem
              activity={activity}
              openActivity={openActivity}
              key={activity?.id}
              onDelete={handleOpenDeleteAlert}
            />
          ))}
        </IonList>
        {publishedActivities?.length !== 0 && <IonText>
          <h4>Actividades publicadas</h4>
        </IonText>}
        <IonList>
          {publishedActivities.map((activity) => (
            <ActivityListItem
              activity={activity}
              openActivity={openActivity}
              key={activity?.id}
              onDelete={handleOpenDeleteAlert}
            />
          ))}
        </IonList>
        {activities?.length === 0 && <IonText>
          Aun no tienes actividades publicadas
        </IonText>}
        <IonFab slot='fixed' horizontal='end' vertical='bottom'>
          <IonFabButton onClick={() => presentActivityNameModal({id: 'activity-name-modal'})}>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
      <IonAlert
        header='Está seguro de que desea eliminar la actividad?'
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
            handler: async () => {
              await handleDelete(activityToBeDeletedId)
            },
          },
        ]}
      ></IonAlert>
    </IonPage>
  )
}

export default ActivitiesPage
