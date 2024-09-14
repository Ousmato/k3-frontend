import { Admin } from "./Admin";
import { ClassRoom } from "./Classe";
import { Emplois } from "./Emplois";
import { Module } from "./Module";
import { AnneeScolaire } from "./School-info";

export interface Student {
    numero?: number;
    idEtudiant?: number;
    nom: string;
    prenom: string;
    sexe: string;
    email: string;
    scolarite?: number;
    payer?: boolean;
    telephone: number;
    password: string;
    active?: boolean;
    urlPhoto?: string;
    matricule: string;
    date?: string; 
    idAnneeScolaire: AnneeScolaire;
    lieuNaissance: string;
    dateNaissance: string; 
    idClasse : ClassRoom;
    idAdmin?: Admin;
    modules?: Module[]
    status: Type_status;
}

export interface Student_reinscription{
    idStudent: number;
    idClasse: number;
    idAnnee: number
}

export enum Type_status{
    REG = 'régulier',
    PROFESSIONNEL = 'professionnel',
    LIBRE = 'libre'
}

export interface Student_group{
    id?: number;
    nom: string;
    idEmploi: Emplois;
}

export interface Participant{
    id?: number;
    idStudentGroup: Student_group;
    idStudent: Student

}

export interface Student_count{
    inscrit: number;
    non_inscrit: number;
}