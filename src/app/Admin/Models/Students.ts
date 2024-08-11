import { Admin } from "./Admin";
import { ClassRoom } from "./Classe";
import { Emplois } from "./Emplois";
import { Module } from "./Module";

export interface Student {
    numero?: number;
    idEtudiant?: number;
    nom: string;
    prenom: string;
    sexe: string;
    email: string;
    scolarite?: number;
    frais?: number;
    telephone: number;
    password: string;
    active?: boolean;
    urlPhoto?: string;
    matricule: string;
    date?: string; 
    lieuNaissance: string;
    dateNaissance: string; 
    idClasse : ClassRoom;
    idAdmin?: Admin;
    modules?: Module[]
    status: Type_status;
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