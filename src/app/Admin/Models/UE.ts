
import { Ecue } from "./Module";
import { Semestres } from "./Semestre";

export interface Ue{
    id?:number;
    nomUE:string;
}

export interface AddUeDto{

    idClasse: number;
    semestre: Semestres
    idUe: Ue
    modules: Ecue[];
}
