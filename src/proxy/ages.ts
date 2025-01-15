import { millaApiUrl } from "../auth.config";
import { Age } from "../domain/age";
import { mapAgesResponseToAges } from "../domain/mappers/age";
import { getAuth } from "../utils/auth-utils";

export async function getAges(): Promise<Age[]> {
    try {
        const response = await fetch(`${millaApiUrl}/api/ages`, {
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
        return mapAgesResponseToAges(data);
    } catch (error) {
        throw error;
    }
}