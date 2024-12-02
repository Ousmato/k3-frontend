import { Ue } from "./UE";

export interface  Module{
    id?: number;
    nomModule: string;
    coefficient: number;
    idUe: Ue;
    noteModule?: number;
   
}

export interface Ecue{
    id?: number
    nomModule: string;
    coefficient: number;
}
