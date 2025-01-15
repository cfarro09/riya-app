import {Event} from 'react-big-calendar'
import {Schedule, ScheduleRequest, ScheduleResponse} from '../schedule'
import {Duration} from '../duration';
import { getWeekDayInActualWeek, getWeekStartDate } from '../../utils/time';
import { StrapiCollectionResponse } from '../response';
import { DBStatus } from '../db-status';

export const mapSchedulesToEventList = (
  schedules: Schedule[],
  duration: Duration,
  title: string | undefined | null
): Event[] => {
  return schedules.map((schedule) => mapScheduleToEvent(schedule, duration, title));
}

export const mapScheduleToEvent = (schedule: Schedule, duration: Duration, title: string | undefined | null): Event => {
  const start = getWeekDayInActualWeek(schedule?.hour);
  const end = new Date(start.getTime() + duration?.getTime())
  return {title, start, end, resource: schedule?.id}
}

export function mapScheduleToScheduleResponse(schedule: Schedule): ScheduleResponse {
  return {
    hour: schedule?.hour
  }
}

export function mapSchedulesResponseToSchedules(scheduleResponse: StrapiCollectionResponse<ScheduleResponse>): Schedule[]{
  return scheduleResponse?.data?.map(schedule => {
    return {
      saved: DBStatus.SAVED,
      hour: schedule?.attributes?.hour ? new Date(schedule?.attributes?.hour) : null,
      id: schedule.id
    }
  });
}

export function mapScheduleToScheduleRequest(schedule: Schedule, activityId: number): ScheduleRequest {
  return {
    hour: schedule?.hour,
    activity: activityId
  }
}
