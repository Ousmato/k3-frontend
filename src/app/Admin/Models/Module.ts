import { Ue } from "./UE";

export interface  Module{
    id?: number;
    nomModule: string;
    coefficient: number;
    idUe: Ue;
    description?: string;
    noteModule?: number;
   
}

export interface Ecue{
    id?: number
    nomModule: string;
    VHT?: number
    TD?: number
    CM?: number
    description?: string
    coefficient: number;
}
