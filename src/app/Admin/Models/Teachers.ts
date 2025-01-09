import { Admin } from "./Admin";
import { Filiere, Specialites } from "./Filieres";
import { type_seance } from "./Seances";
import { Ue } from "./UE";

export interface Teacher {
    numero?: number;
    idEnseignant?: number;
    nom: string;
    prenom: string;
    email: string;
    sexe: string;
    diplome: Diplomes;
    password?: string;
    telephone: number;
    urlPhoto?: string;
    isDeleted?: boolean;
    status: TeachersStatus;
    admin: Admin
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

export interface TeacherDto{
    numero?: number;
    idEnseignant?: number;
    nom: string;
    prenom: string;
    email: string;
    sexe: string;
    diplome: Diplomes;
    telephone: number;
    urlPhoto?: string;
    status: TeachersStatus;
    specialitesList: Specialites[]
}

export interface teacherConfigureDto{
    id : number;
    nom : string;
    prenom: string;
    salle : string;
    groupe: string;
    seanceType: type_seance[];
}