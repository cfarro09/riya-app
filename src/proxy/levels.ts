import { millaApiUrl } from "../auth.config";
import { mapLevelsResponseToLevels } from "../domain/mappers/level";
import { Level } from "../domain/level";
import { getAuth } from "../utils/auth-utils";

export async function getLevels(): Promise<Level[]> {
    try {
        const response = await fetch(`${millaApiUrl}/api/levels`, {
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
        return mapLevelsResponseToLevels(data);
    } catch (error) {
        throw error;
    }
}