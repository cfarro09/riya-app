

import { millaApiUrl } from "../auth.config";
import { mapActivityResponseToActivity } from "../domain/mappers/activity";
import { mapPriceResponseToPrice, mapPricesResponseToPrices } from "../domain/mappers/price";
import { mapScheduleToScheduleRequest, mapScheduleToScheduleResponse } from "../domain/mappers/schedule";
import { Price } from "../domain/price";
import { Schedule, ScheduleResponse } from "../domain/schedule";
import { getAuth } from "../utils/auth-utils";

export async function createSchedule(schedule: Schedule, activityId: number): Promise<ScheduleResponse> {
  try {
    const response = await fetch(`${millaApiUrl}/api/schedules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuth()?.jwt}`,
      },
      body: JSON.stringify({
        data: mapScheduleToScheduleRequest(schedule, activityId)
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const activityResponse = await response.json();
    return mapScheduleToScheduleResponse(activityResponse);
  } catch (error) {
    throw error;
  }
}

export async function removeSchedule(scheduleId: number): Promise<void> {
  try {
    const response = await fetch(`${millaApiUrl}/api/schedules/${scheduleId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuth()?.jwt}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
  } catch (error) {
    throw error
  }
}
