import { Admin } from "./Admin";


export interface Filiere{
    id?:number;
    nomFiliere:string;

}

export enum FiliereNiveau{
    L1 = "LICENCE 1",
    L2 = "LICENCE 2",
    L3 = "LICENCE 3",
}

export interface Specialites{
    id?:number;
    nom: string
    idAdmin: Admin
}
export interface filiereSpecialite{
    id: number
    filieres: Filiere[]
    specialite: Specialites
}