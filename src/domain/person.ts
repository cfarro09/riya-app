import { Activity } from "./activity";
import { Age } from "./age";
import { Level } from "./level";

export interface Person {
    id: number;
    name: string;
    dni: string;
}

export interface PersonRequest {
    name: string;
    dni: string;
}

export interface PersonResponse { 
    name: string;
    dni: string;
}