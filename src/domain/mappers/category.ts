import {millaApiUrl} from '../../auth.config'
import {Category, CategoryResponse} from '../category'
import {Media} from '../media'
import {StrapiCollectionResponse, StrapiSingleResponse} from '../response'
import { mapMediaResponseToMedia } from './media'

export function mapCategoriesResponse(
  response: StrapiCollectionResponse<CategoryResponse>
): Category[] {
  return response.data.map((response) => ({
    id: response.id,
    name: response.attributes.name,
    picture: mapMediaResponseToMedia(response.attributes.picture),
  }))
}

export function mapCategoryResponse(response: StrapiSingleResponse<CategoryResponse>): Category | undefined {
  if (!response || !response?.data) {
    return undefined;
  }
  
  return {
    id: response?.data?.id,
    name: response?.data?.attributes?.name,
    picture: mapMediaResponseToMedia(response?.data?.attributes?.picture),
  }
}
