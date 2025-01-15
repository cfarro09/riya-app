

import { millaApiUrl } from "../auth.config";
import { mapPriceToPriceRequest, mapSinglePriceResponseToPrice } from "../domain/mappers/price";
import { Price } from "../domain/price";
import { getAuth } from "../utils/auth-utils";

export async function createPrice(price: Price, activity: number): Promise<Price> {
  try {
    const response = await fetch(`${millaApiUrl}/api/prices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuth()?.jwt}`,
      },
      body: JSON.stringify({
        data: mapPriceToPriceRequest(price, activity)
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const priceResponse = await response.json();
    return mapSinglePriceResponseToPrice(priceResponse);
  } catch (error) {
    throw error;
  }
}

export async function removePrice(priceId: number): Promise<void> {
  try {
    const response = await fetch(`${millaApiUrl}/api/prices/${priceId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuth()?.jwt}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
  } catch (error) {
    throw error
  }
}