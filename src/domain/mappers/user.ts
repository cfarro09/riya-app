import { StrapiSingleResponse } from '../response'
import {Auth0UserResponse, User, UserResponse} from '../user'
import {mapMediaResponseToMedia, mapUserEndpointMediaResponseToMedia} from './media'

export function mapAuth0UserResponseToUser({ jwt, user }: Auth0UserResponse): User {
  return { jwt, ...user }
}

export function mapUserResponseToUser(response: StrapiSingleResponse<UserResponse>): User {
  return {
    id: response?.data?.id || 0,
    jwt: response?.data?.attributes?.jwt,
    username: response?.data?.attributes?.username || '',
    name: response?.data?.attributes?.name || '',
    email: response?.data?.attributes?.email || '',
    blocked: response?.data?.attributes?.blocked || false,
    onboarded: response?.data?.attributes?.onboarded || false,
    address: response?.data?.attributes?.address || '',
    auth0Id: null,
    type: response?.data?.attributes?.type || '',
    picture: mapMediaResponseToMedia(response?.data?.attributes?.picture),
    categories: response?.data?.attributes?.categories || []

  }
}

export function mapUserMeToUser(user: User): User {
  return {
    ...user,
    picture: mapUserEndpointMediaResponseToMedia(user.picture)
  }
}