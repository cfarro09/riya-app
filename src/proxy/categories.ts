import { millaApiUrl } from "../auth.config";
import { Category } from "../domain/category";
import { mapCategoriesResponse } from "../domain/mappers/category";
import { getAuth } from "../utils/auth-utils";

export async function getCategories(): Promise<Category[]> {
    try {
        const response = await fetch(`${millaApiUrl}/api/categories?populate=*&pagination[pageSize]=40`, {
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
        return mapCategoriesResponse(data);
    } catch (error) {
        throw error;
    }
}