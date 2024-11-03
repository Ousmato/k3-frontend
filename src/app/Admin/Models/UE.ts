
import { Admin } from "./Admin";
import { Ecue } from "./Module";
import { Semestres } from "./Semestre";

export interface Ue{
    id?:number;
    nomUE:string;
    idAdmin: Admin
}

export interface AddUeDto{

    idClasse: number;
    semestre: Semestres
    idUe: Ue
    modules: Ecue[];
}


