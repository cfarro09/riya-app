import { act } from "react-dom/test-utils";
import { Activity, ActivityRequest, ActivityResponse } from "../activity";
import { Duration } from "../duration";
import { StrapiCollectionResponse, StrapiResponse, StrapiSingleResponse } from "../response";
import { mapAgesResponseToAges } from "./age";
import { mapLevelsResponseToLevels } from "./level";
import { mapMediaResponsesToMedia } from "./media";
import { mapPricesResponseToPrices } from "./price";
import { mapCategoryResponse } from "./category";
import { mapUserResponseToUser } from "./user";
import { mapSchedulesResponseToSchedules } from "./schedule";

export function mapActivityResponseToActivity({ id, attributes }: StrapiResponse<ActivityResponse>): Partial<Activity> { 
  return {
    id,
    name: attributes.name,
    description: attributes.description ?? undefined,
    includedWith: attributes?.includedWith ? attributes?.includedWith?.split(',') : [],
    notAllowedFor: attributes?.notAllowedFor ? attributes?.notAllowedFor?.split(',') : [],
    hasRights: attributes.hasRights ?? undefined,
    paymentMethod : attributes.paymentMethod  ?? undefined,
    phonetopay : attributes.phonetopay  ?? undefined,
    address: attributes.address ?? undefined,
    lat: attributes.lat ?? undefined,
    lng: attributes.lng ?? undefined,
    reference: attributes.reference ?? undefined,
    additionalItems: attributes.additionalItems ?? undefined,
    activityType: attributes.activityType ?? undefined,
    vacancies: attributes.vacancies ?? undefined,
    mainPictureIndex: attributes.mainPictureIndex ?? undefined,
    duration: attributes.duration ? new Duration(attributes.duration) : undefined,
    pictures: mapMediaResponsesToMedia(attributes.pictures),
    ages: mapAgesResponseToAges(attributes.ages),
    levels: mapLevelsResponseToLevels(attributes.levels),
    prices: mapPricesResponseToPrices(attributes.prices),
    category: mapCategoryResponse(attributes?.category),
    creator: mapUserResponseToUser(attributes?.creator), 
    schedules: mapSchedulesResponseToSchedules(attributes?.schedules),
    publishedAt: attributes.publishedAt !== null ? new Date(attributes.publishedAt) : null,
  };
}

export function mapActivitiesResponseToActivities(activities: StrapiCollectionResponse<ActivityResponse>): Partial<Activity>[] {
  return activities.data.map(activityResponse => mapActivityResponseToActivity(activityResponse));
}

export function mapActivityToActivityRequest(activity: Partial<Activity>): Partial<ActivityRequest> {
  return {
    id: activity.id,
    name: activity.name ?? undefined,
    description: activity.description ?? undefined,
    includedWith: activity.includedWith?.join(',') ?? undefined,
    notAllowedFor: activity.notAllowedFor?.join(',') ?? undefined,
    hasRights: activity.hasRights ?? false,
    paymentMethod : activity.paymentMethod  ?? "",
    phonetopay : activity.phonetopay  ?? "",
    address: activity.address ?? undefined,
    lat: activity.lat ?? undefined,
    lng: activity.lng ?? undefined,
    reference: activity.reference ?? undefined,
    additionalItems: activity.additionalItems ?? undefined,
    activityType: activity.activityType ?? undefined,
    vacancies: activity.vacancies ?? undefined,
    duration: activity.duration ? activity.duration.minutes : undefined,
    mainPictureIndex: activity.mainPictureIndex ?? undefined,
    category: activity.category?.id ?? undefined,
    pictures: activity?.pictures?.map(picture => picture.id) ?? undefined,
    ages: activity?.ages?.map(age => age.id) ?? [],
    levels: activity?.levels?.map(level => level.id) ?? [],
    publishedAt: activity?.publishedAt?.toISOString() ??  null,
  };
}