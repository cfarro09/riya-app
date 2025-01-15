export interface StrapiResponse<T> {
  id: number
  attributes: T
}

export interface StrapiCollectionResponse<K> {
  data: StrapiResponse<K>[]
}

export interface StrapiSingleResponse<L> {
  data: StrapiResponse<L> | null
  url?: string
}
