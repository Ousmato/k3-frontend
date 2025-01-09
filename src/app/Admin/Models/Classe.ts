
import { NivFiliere } from "./NivFiliere";
import { AnneeScolaire } from "./School-info";
import { Inscription } from "./Students";

export interface ClassRoom{
    id?:number;
    effectifs?: number;
    idFiliere?: NivFiliere
    idAnneeScolaire?: AnneeScolaire
    specialites: Specialite_Filiere[]

}

export interface DTONivauFiliereClass{
    scolarite: number;
    idFiliere: number;
    idNiveau: number;
    idAnnee: number
}

export interface Specialite_Filiere{
    id?:number;
    nomSousFiliere: string;
    inscriptions: Inscription[]
}