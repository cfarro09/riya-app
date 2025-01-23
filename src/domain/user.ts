import { Category } from "./category";
import { Media, MediaResponse } from "./media";
import { StrapiSingleResponse } from "./response";

export interface User {
    jwt?: string
    username: string,
    name: string,
    email: string,
    blocked: boolean,
    onboarded: null | boolean,
    id: number,
    isMyTrainer?: boolean,
    address: null | string,
    type: null | string,
    auth0Id: null | string,
    avgRating?: number,
    userRating?: number,
    picture: Media | undefined,
    categories?: Category[]
}

export interface UserResponse {
    jwt?: string
    username: string,
    name: string,
    email: string,
    type: string,
    blocked: boolean,
    onboarded: null | boolean,
    address: null | string,
    auth0Id: null | string,
    picture: StrapiSingleResponse<MediaResponse>,
    categories?: Category[]
}

export interface Auth0UserResponse {
    jwt: string,
    user: User
}