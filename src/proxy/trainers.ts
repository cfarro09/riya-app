import { millaApiUrl } from "../auth.config";
import { mapUserMeToUser } from "../domain/mappers/user";
import { User, } from "../domain/user";
import { getAuth } from "../utils/auth-utils";

export async function getTrainers(): Promise<User[]> {
    try {
        // const response = await fetch(`${millaApiUrl}/api/users?populate[0]=picture`, {
        const response = await fetch(`${millaApiUrl}/api/users-with-ratings?populate[0]=picture`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuth()?.jwt}`,
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.map((user: User) => mapUserMeToUser(user));
    } catch (error) {
        throw error;
    }
}

export async function setRatingToTrainner(data11: {
    from_user: number
    admin_user: number
    rating: number
}) {
    try {
        const response = await fetch(`${millaApiUrl}/api/rate-user`, {
        // const response = await fetch(`${millaApiUrl}/api/users-with-ratingsusers?populate[0]=picture`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuth()?.jwt}`,
            },
            body: JSON.stringify(data11)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.map((user: User) => mapUserMeToUser(user));
    } catch (error) {
        throw error;
    }
}