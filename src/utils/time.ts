import { Schedule, WeekDay } from "../domain/schedule";

export const DAY_IN_MILISECONDS = 24 * 60 * 60 * 1000;

export const getWeekStartDate = (startDate: Date = new Date()): Date => {
    const weekStart = startDate ?? new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    return weekStart;
}

export const getActualWeek = (startDate: Date = new Date()): Date[] => {
    const weekStart = getWeekStartDate(startDate);
    const week = [weekStart];
    for (let i = 1; i < 7; i++) {
        week.push(new Date(weekStart.getTime() + i * DAY_IN_MILISECONDS));
    }
    return week;
}

export const getWeekDayInActualWeek = (date: Date | null | undefined): Date => {
    const weekStartDate: Date = getWeekStartDate();
    if (date) {
        const start = new Date(weekStartDate.getTime() + (date.getDay() ?? 0) * DAY_IN_MILISECONDS);
        start.setHours(date?.getHours() ?? 0)
        start.setMinutes(date?.getMinutes() ?? 0)
        return start;
    }
    return weekStartDate;
}

export const isThereAScheduleOnThisWeekDay = (schedules: Schedule[], weekDay: number): boolean => {
    return schedules.some((schedule: Schedule) => schedule.hour!.getDay() === weekDay)
}

