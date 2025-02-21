import { Admin } from "./Admin";
import { TeacherEmplois } from "../../DER/EDT/Models/Emplois";
import { Filiere, Specialites } from "./Filieres";

export interface Teacher {
    numero?: number;
    idEnseignant?: number;
    nom: string;
    grade?: string;
    prenom: string;
    email: string;
    dateNaissance: string;
    sexe: string;
    diplome: Diplomes;
    password?: string;
    telephone: number;
    urlPhoto?: string;
    active?: boolean;
    desable?: boolean;
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

export enum TeacherGrade{
    ASSISTANT = "ASSISTANT",
    M_CONFERENCE = "MAITRE DE CONFERENCES",
    M_ASSISTANT = "MAITRE ASSISTANT",
    PROFESSEUR = "PROFESSEUR"

}

export interface TeacherDto{
    numero?: number;
    idEnseignant?: number;
    nom: string;
    prenom: string;
    email: string;
    dateNaissance: string
    sexe: string;
    desable: boolean;
    heureTotal: number
    diplome: Diplomes;
    telephone: number;
    urlPhoto?: string;
    teacherEmploiList: TeacherEmplois[]
    status: TeachersStatus;
    specialitesList: Specialites[]
}

export interface teacherConfigureDto{
    id : number;
    nom : string;
    prenom: string;
    salle : string;
    groupe: string;
    seanceType: string;
    idGroupe: number
}