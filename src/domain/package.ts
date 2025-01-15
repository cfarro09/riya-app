export interface Package extends PackageResponse {
    id: number
}

export interface PackageResponse {
    name: string
    multiplier: number
}