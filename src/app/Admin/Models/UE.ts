
import { Admin } from "./Admin";
import { Ecue } from "./Module";
import { Semestres } from "./Semestre";

export interface Ue{
    id?:number;
    nomUE:string;
    codeUE?: string;
    idSemestre?: Semestres
    active?: boolean
    idAdmin: Admin
}

export interface AddUeDto{

    idClasse: number;
    semestre: Semestres
    idUe: Ue
    modules: Ecue[];
}


