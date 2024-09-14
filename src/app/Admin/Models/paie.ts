import { Journee } from "./Configure_seance";

export interface Paie{
    id?: number;
    date?: Date;
    coutHeure: number;
    coutHeureFormatter?: string;
    nbreHeures: number;
    montant?: number;
    montantFormatter?: string;
    journee: Journee;
}
export interface PaieDTO {
    id?: number;
    idTeacher: number;
    coutHeure: number;
    nbreHeures: number;
    date: string;
    nom: string;
    montant: number;
    prenom: string;
    niveau: string;
    filiere: string;
    module: string;
    type: string;
    montanFormat: string;
}