import { DBStatus } from '../db-status';
import { Price, PriceRequest, PriceResponse } from '../price';
import { StrapiCollectionResponse, StrapiResponse, StrapiSingleResponse } from '../response';
import { mapAgeResponseToAge } from './age';
import { mapLevelResponseToLevel } from './level';
import { mapPackageResponseToPackage } from './package';

export function mapPriceToPriceRequest(price: Price, activityId: number): PriceRequest {
    const priceRequest: PriceRequest = {
        priceDefinition: price.priceDefinition,
        value: price.value,
        numberOfClasses: price.numberOfClasses,
        level: price.level?.id || null,
        age: price.age?.id || null,
        pricePackage: price.pricePackage?.id || null,
        activity: activityId
    };
    return priceRequest;
}


export function mapSinglePriceResponseToPrice(priceResponse: StrapiSingleResponse<PriceResponse>): Price {
    if (!priceResponse.data) {
        throw new Error('Single Price response is empty');
    }

    return mapPriceResponseToPrice(priceResponse.data);
}

export function mapPriceResponseToPrice(priceResponse: StrapiResponse<PriceResponse>): Price {
    if (!priceResponse) {
        throw new Error('Price response is empty');
    }

    return {
        id: priceResponse.id,
        priceDefinition: priceResponse.attributes.priceDefinition,
        value: priceResponse.attributes.value,
        numberOfClasses: priceResponse.attributes.numberOfClasses,
        level: mapLevelResponseToLevel(priceResponse.attributes.level),
        age: mapAgeResponseToAge(priceResponse.attributes.age),
        saved: DBStatus.SAVED,
        pricePackage: mapPackageResponseToPackage(priceResponse.attributes.pricePackage)
    }
} 

export function mapPricesResponseToPrices(response: StrapiCollectionResponse<PriceResponse>): Price[] {
    return response?.data?.map(priceResponse => mapPriceResponseToPrice(priceResponse));
}