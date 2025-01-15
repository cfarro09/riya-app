import { Activity, ActivityResponse } from "./activity"
import { Age, AgeResponse } from "./age"
import { Level, LevelResponse } from "./level"
import { Person, PersonResponse } from "./person"
import { Price, PriceResponse } from "./price"
import { StrapiCollectionResponse, StrapiSingleResponse } from "./response"
import { Schedule, ScheduleResponse } from "./schedule"
import { User, UserResponse } from "./user"

export interface Booking {
    id?: number
    activity: Partial<Activity>,
    schedulesSelected: Schedule[],
    persons: Person[],
    level?: Level,
    age?: Age,
    startDate: Date,
    price: Price,
    creator: Partial<User>
}

export interface BookingRequest {
    activity: number
    schedulesSelected: number[]
    persons: number[] | Person[]
    level?: number
    age?: number
    startDate: Date
    price: number
    creator: number
}

export interface BookingResponse {
    id: number
    activity: StrapiSingleResponse<ActivityResponse>
    schedulesSelected: StrapiCollectionResponse<ScheduleResponse>
    persons: StrapiCollectionResponse<PersonResponse>
    level?: StrapiSingleResponse<LevelResponse>
    age?: StrapiSingleResponse<AgeResponse>
    startDate: Date
    price: StrapiSingleResponse<PriceResponse>
    creator: StrapiSingleResponse<UserResponse>
}