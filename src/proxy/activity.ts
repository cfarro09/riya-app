import { User } from '@auth0/auth0-react'
import {millaApiUrl} from '../auth.config'
import {Activity, ActivityResponse} from '../domain/activity'
import {
  mapActivitiesResponseToActivities,
  mapActivityResponseToActivity,
  mapActivityToActivityRequest,
} from '../domain/mappers/activity'
import {StrapiCollectionResponse} from '../domain/response'
import {getAuth} from '../utils/auth-utils'
import { createSchedule, removeSchedule } from './schedules'
import { Schedule } from '../domain/schedule'
import { DBStatus } from '../domain/db-status'
import { createPrice, removePrice } from './price'
import { Price } from '../domain/price'

export async function createActivity(name: string, userId: number): Promise<Partial<Activity>> {
  try {
    const response = await fetch(`${millaApiUrl}/api/activities?populate=*`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuth()?.jwt}`,
      },
      body: JSON.stringify({
        data: {
          name,
          creator: userId ,
          publishedAt: null,
        },
      }),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const activityResponse = await response.json()
    return mapActivityResponseToActivity(activityResponse.data)
  } catch (error) {
    throw error
  }
}

export async function updateActivity(activity: Partial<Activity>, userId: number): Promise<Partial<Activity>> {
  try {
    const activityRequest = mapActivityToActivityRequest(activity)
    const response = await fetch(`${millaApiUrl}/api/activities/${activity.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuth()?.jwt}`,
      },
      body: JSON.stringify({
        data: {...activityRequest, creator: userId},
      }),
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const activityResponse = await response.json();
    await processSchedules(activity.id!, activity.schedules!);
    await processPrices(activity.id!, activity.prices!);
    return mapActivityResponseToActivity(activityResponse.data)
  } catch (error) {
    throw error
  }
}

export async function processSchedules(activityId: number, schedules: Schedule[] = []) {
  schedules.forEach(async (schedule) => {
    if (schedule?.saved === DBStatus.NEW) {
      await createSchedule(schedule, activityId);  
    } else if (schedule?.saved === DBStatus.TOBEDELETED) {
      await removeSchedule(schedule.id!);
    }
  });
}

export async function processPrices(activityId: number, prices: Price[] = []) {
  prices.forEach(async (price) => {
    if (price?.saved === DBStatus.NEW) {
      await createPrice(price, activityId);  
    } else if (price?.saved === DBStatus.TOBEDELETED) {
      await removePrice(price.id!);
    }
  });
}

export async function getMyActivities(userId: number): Promise<Partial<Activity>[]> {
  try {
    const response = await fetch(
      `${millaApiUrl}/api/activities?populate[ages][populate]=*&populate[levels][populate]=*&populate[pictures][populate]=*&populate[creator]=*&populate[category]=*&filters[creator][id][$eq]=${userId}&publicationState=preview&populate[schedules][populate]=*&populate[prices][populate]=*`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuth()?.jwt}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const activityResponse = (await response.json()) as StrapiCollectionResponse<ActivityResponse>
    return mapActivitiesResponseToActivities(activityResponse)
  } catch (error) {
    throw error
  }
}

export async function getActivities(): Promise<Partial<Activity>[]> {
  try {
    const response = await fetch(
      `${millaApiUrl}/api/activities?populate[prices][populate]=level&populate[prices][populate]=age&populate[prices][populate]=pricePackage&populate[ages][populate]=*&populate[levels][populate]=*&populate[pictures][populate]=*&populate[creator]=*&populate[category]=*&populate[schedules][populate]=*&pagination[limit]=100`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuth()?.jwt}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const activityResponse = (await response.json()) as StrapiCollectionResponse<ActivityResponse>
    return mapActivitiesResponseToActivities(activityResponse)
  } catch (error) {
    throw error
  }
}

export async function removeActivity(activityId: number) {
  try {
    const response = await fetch(`${millaApiUrl}/api/activities/${activityId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuth()?.jwt}`,
      },
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
  } catch (error) {
    throw error
  }
}

export async function getActivitiesByCategory(categoryId: number): Promise<Partial<Activity>[]> {
  try {
    const response = await fetch(
      `${millaApiUrl}/api/activities?populate[prices][populate]=level&populate[prices][populate]=age&populate[prices][populate]=pricePackage&populate[ages][populate]=*&populate[levels][populate]=*&populate[pictures][populate]=*&populate[creator]=*&populate[category]=*&populate[schedules][populate]=*&pagination[limit]=1000&filters[category][id][$eq]=${categoryId}`,
      // `${millaApiUrl}/api/activities?populate=*&filters[category][id][$eq]=${categoryId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuth()?.jwt}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const activityResponse = (await response.json()) as StrapiCollectionResponse<ActivityResponse>
    return mapActivitiesResponseToActivities(activityResponse)
  } catch (error) {
    throw error
  }
}

export const ActivityProxy = {
  createActivity,
  removeActivity,
  updateActivity,
  getActivitiesByCategory,
}
