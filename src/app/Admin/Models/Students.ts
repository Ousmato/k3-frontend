import { Admin } from "./Admin";

export interface Student {
    idEtudiant: number;
    nomStudent: string;
    prenom: string;
    sexe: string;
    email: string;
    scolarite: string;
    telephone: number;
    password: string;
    urlPhoto: string;
    matricule: string;
    date: string; 
    lieuNaissance: string;
    dateNaissance: string; 
    
    // isDeleted: boolean;
    admin: Admin;
}