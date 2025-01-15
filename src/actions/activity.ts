import { Activity } from "../domain/activity";
import { ActivityActions, DispatchActivity } from "../store/ActivityProvider";


export const updateActivity = ({
  activity,
  activities,
}: {
  activity: Partial<Activity>;
  activities: Partial<Activity>[]
}, dispatch: DispatchActivity) => {
  const index = activities.findIndex(act => act.id === activity.id);

  if (index !== -1) {
    const prevActivity = { ...activities[index] };

    activities[index] = {
      ...prevActivity,
      ...activity,
    }
  } else {
    activities = [
      ...activities,
      activity
    ]
  }

  dispatch({
    type: ActivityActions.SetLocalAcivities,
    payload: activities,
  });
}