import { Filiere } from "./Filieres";
import { Niveau } from "./Niveau";

export interface NivFiliere{
    id?:number;
    idNiveau: Niveau;
    idFiliere: Filiere
    scolarite: number
}
