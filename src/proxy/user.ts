import { millaApiUrl } from '../auth.config'
import { getAuth } from '../utils/auth-utils'
import { User } from '../domain/user'
import { mapUserMeToUser } from '../domain/mappers/user'

export async function updateUser({
  currentUserId,
  categories,
  address,
  type,
  name,
}: {
  currentUserId: number
  categories: number[]
  address: string
  type: string
  name: string
}): Promise<void> {
  try {
    const response = await fetch(`${millaApiUrl}/api/users/${currentUserId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuth()?.jwt}`,
      },
      body: JSON.stringify({
        address: address,
        onboarded: true,
        categories: categories,
        type,
        name,
      }),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
  } catch (error) {
    throw error
  }
}

export async function getUserMe(): Promise<User> {
  try {
    const response = await fetch(
      `${millaApiUrl}/api/users/me?populate[categories]=*&populate[picture]=*&populate[activities][populate]=category&populate[activities][populate]=pictures&populate[activities][populate]=ages&populate[activities][populate]=levels&populate[activities][populate]=prices&populate[activities][populate]=schedules`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuth()?.jwt}`,
        },
      }
    )
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    return mapUserMeToUser(data);
  } catch (error) {
    throw error
  }
}
