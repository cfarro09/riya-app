import {Age, AgeResponse} from './age'
import { DBStatus } from './db-status'
import {Level, LevelResponse} from './level'
import { Package, PackageResponse } from './package'
import { StrapiSingleResponse } from './response'

export enum PriceDefinition {
    EDAD,
    NIVEL,
    AMBOS,
    NINGUNO,
  }

export const PRICE_DEFINITION_LITERALS = {
    [PriceDefinition.EDAD]: 'Por Edad',
    [PriceDefinition.NIVEL]: 'Por Nivel',
    [PriceDefinition.AMBOS]: 'Por Edad y por Nivel',
    [PriceDefinition.NINGUNO]: 'Ninguno',
}

export interface Price {
  id: number
  pricePackage: Package | undefined
  level: Level | undefined
  age: Age | undefined,
  saved: DBStatus
  priceDefinition?: PriceDefinition
  value: number
  numberOfClasses: number
}

export interface PriceResponse {
  level: StrapiSingleResponse<LevelResponse>
  age: StrapiSingleResponse<AgeResponse>
  pricePackage: StrapiSingleResponse<PackageResponse>
  priceDefinition?: PriceDefinition
  value: number
  numberOfClasses: number
}

export interface PriceRequest {
  level: number | null
  age: number | null
  pricePackage: number | null
  priceDefinition?: PriceDefinition
  value: number
  numberOfClasses: number
  activity: number
}


