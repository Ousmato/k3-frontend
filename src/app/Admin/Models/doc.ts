import { Admin } from "./Admin";
import { ClassRoom } from "./Classe";
import { Salles } from "./Salles";
import { Student } from "./Students";
import { Teacher } from "./Teachers";

export enum TypeDoc{
    RAPPORT = "rapport",
    MEMOIRE = "memoire"
}

export interface Docum {
    id?: number;
    docType: TypeDoc
    date?: Date
    soutenue?: boolean
    programmer?: boolean
    idEncadrant: Teacher
    
}

export interface Soutenance{
    id?: number
    heureDebut: string
    heureFin: string
    students?: Student[]
    idDoc: Docum
    filiere?: string
    niveaux?: string
    idSalle: Salles
    date: Date
    idTeacher?: Teacher
    idJury?: Jury[]
    
}

export interface Jury{
    id?: number
    role: string
    idTeacher: number;
    teachers?: Teacher
    idSoutenance?: Soutenance;

}
export enum Jury_role{
    PRESIDENT = "President",
    RAPPORTEUR = "Rapporteur"
}

export interface StudentDoc{
    id?: number
    idDocument: Docum
    idEtudiant: Student[]
    telephone? : number;
    nom ?: string;
    prenom? : string;
    niveau ?: string;
    filiere? : string;
}

export interface ProgramSoutenance{
    jurys: Jury[]
    soutenance: Soutenance
}