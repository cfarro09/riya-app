export interface Age extends AgeResponse {
    id: number;
}

export interface AgeResponse {
    name: string,
    startAge: number,
    endAge: number
}