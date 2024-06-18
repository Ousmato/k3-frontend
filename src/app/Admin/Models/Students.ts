import { Admin } from "./Admin";
import { ClassRoom } from "./Classe";

export interface Student {
    idEtudiant?: number;
    nom: string;
    prenom: string;
    sexe: string;
    email: string;
    scolarite: string;
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
}