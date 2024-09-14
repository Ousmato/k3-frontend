import { Ue } from "./UE";

export interface Teacher {
    numero?: number;
    idEnseignant?: number;
    nom: string;
    prenom: string;
    email: string;
    sexe: string;
    idUe: Ue,
    diplome: Diplomes;
    password?: string;
    telephone: number;
    urlPhoto?: string;
    isDeleted?: boolean;
    status: TeachersStatus;
}

export enum TeachersStatus {
    PEMANENT = 'Vacataire',
    PRINCIPAL = 'Permanent'
}

export enum Diplomes{
    L1 = 'Licence 1',
    L2 = 'Licence 2',
    M1 = 'Master 1',
    M2 = 'Master 2',
    Doctorat = 'Doctorat'
}