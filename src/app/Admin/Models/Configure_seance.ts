import { Emplois } from "./Emplois";
import { Module } from "./Module";
import { Salles } from "./Salles";
import { Seances, type_seance } from "./Seances";
import { Participant } from "./Students";
import { Teacher } from "./Teachers";

export interface Configure_seance{
    id?: number;
    idSeance?: Seances;
    idParticipant?: Participant;
    id_Participant?: Participant[];
    seanceType: type_seance;
    heureDebut: string;
    heureFin: string;
    idTeacher: Teacher;
    idSalle: Salles
    plageHoraire?: string;
    heure?: number;
    munite?: number;
}

export interface Journee{
    date: Date;
    id?: number;
    idParticipant?: Participant;
    groupe?: Participant[];
    seanceType: type_seance;
    heureDebut: string;
    heureFin: string;
    idTeacher: Teacher;
    idSalle: Salles
    plageHoraire?: string;
    heure?: number;
    munite?: number;
    idEmplois: Emplois,
    module?: Module,
    groupesTdString?: string
    

}

export interface JourneeDTO{
    date: string;
    idParticipant?: string;
    seanceType: string;
    heureDebut: string;
    heureFin: string;
    nomTeacher: string;
    prenomTeacher: string;
    idEmplois: string,
    plageHoraire?: string;
}