import { DBStatus } from "./db-status"

export interface Schedule{
    id: number,
    hour: Date | null
    saved: DBStatus
}

export interface ScheduleRequest{
    hour: Date | null
    activity: number
}

export interface ScheduleResponse {
    hour: Date | null
}

export enum WeekDay {
    Domingo,
    Lunes,
    Martes,
    Miercoles,
    Jueves,
    Viernes,
    Sabado,
}