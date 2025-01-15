import {Media, MediaResponse} from './media'
import {StrapiSingleResponse} from './response'

export interface Category extends CategoryCommon {
  id: number
  picture?: Media
}

export interface CategoryResponse extends CategoryCommon {
  picture: StrapiSingleResponse<MediaResponse>
}

interface CategoryCommon {
  name: string
}
