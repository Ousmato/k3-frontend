import { Filiere } from "./Filieres";
import { Niveau } from "./Niveau";
import { NivFiliere } from "./NivFiliere";
import { AnneeScolaire } from "./School-info";

export interface ClassRoom{
    id?:number;
    effectifs?: number;
    idFiliere?: NivFiliere
    idAnneeScolaire?: AnneeScolaire

}

export interface DTONivauFiliereClass{
    scolarite: number;
    idFiliere: number;
    idNiveau: number;
    idAnnee: number
}