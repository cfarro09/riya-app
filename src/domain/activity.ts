
import { Age, AgeResponse } from "./age";
import { Category, CategoryResponse } from "./category";
import { Media, MediaResponse } from "./media";
import { Level, LevelResponse } from "./level";
import { StrapiCollectionResponse, StrapiResponse, StrapiSingleResponse } from "./response";
import { Schedule, ScheduleResponse } from "./schedule";
import { Duration } from "./duration";
import { User, UserResponse } from "./user";
import { Price, PriceResponse } from "./price";

export interface Activity extends Omit<ActivityCommon, 'duration' | 'id'> {
    id?: number;
    category: Category;
    includedWith: string[];
    notAllowedFor: string[];
    pictures: Media[];
    ages: Age[];
    levels: Level[];
    duration: Duration;
    prices: Price[];
    creator: Partial<User>;
    schedules: Schedule[];
    publishedAt: Date | null;
}

export interface ActivityCommon {
    name: string | null;
    paymentMethod: string | null;
    phonetopay?: string | null;
    description: string | null;
    hasRights: boolean | null;
    address: string | null;
    lat: number | null;
    lng: number | null;
    reference: string | null;
    additionalItems: string | null;
    activityType: 'Actividad' | 'Clase' | null;
    vacancies: number | null;
    mainPictureIndex: number | null;
    id: number,
}

export interface ActivityRequest extends ActivityCommon {
    includedWith: string | null;
    notAllowedFor: string | null;
    category?: number;
    pictures?: number[];
    ages: number[];
    levels: number[];
    creator: number;
    duration: number;
    publishedAt: string | null;
}

export interface ActivityResponse extends ActivityCommon {
    includedWith: string | null;
    notAllowedFor: string | null;
    category: StrapiSingleResponse<CategoryResponse>;
    pictures: StrapiCollectionResponse<MediaResponse>;
    ages: StrapiCollectionResponse<AgeResponse>;
    levels: StrapiCollectionResponse<LevelResponse>;
    prices: StrapiCollectionResponse<PriceResponse>;
    creator: StrapiSingleResponse<UserResponse>;
    schedules: StrapiCollectionResponse<ScheduleResponse>;
    duration: number;
    publishedAt: string | null;
}

