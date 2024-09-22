import { Ue } from "./UE";

export interface  Module{
    id?: number;
    nomModule: string;
    coefficient: number;
    idUe: Ue;
   
}

export interface Ecue{
    nomModule: string;
    coefficient: number;
}
