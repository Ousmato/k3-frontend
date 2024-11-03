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
    lieuNaissance: string;
    dateNaissance: string; 
    idClasse ?: ClassRoom;
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
}

export interface Student_group{
    id?: number;
    nom: string;
    idEmploi: Emplois;
}

export interface Participant{
    id?: number;
    idStudentGroup: Student_group;
    idInscription: Inscription
    idAdmin: Admin

}

export interface Student_count{
    inscrit: number;
    non_inscrit: number;
}

export interface Student_import {
    idClasse: number;
    idAnnee: number;
    scolarite?: number
    students: Student[]
}

export enum StudentEtat{
    Inscrits = 1,
    Non_inscrit = 0,
    Tout = "tout"
}

export interface Inscription{
    id?: number;
    idEtudiant: Student
    idClasse: ClassRoom
    idAdmin: Admin
    date?: Date
    active?: boolean;
    payer?: boolean
    scolarite?: number
    adminPaye?: boolean

}