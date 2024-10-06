import { Emplois } from "./Emplois";
import { Module } from "./Module";
import { Salles } from "./Salles";
import { type_seance } from "./Seances";
import { Participant } from "./Students";
import { Teacher } from "./Teachers";

export interface Surveillance{
    date:  string;

    groupe?: Participant[];
    seanceType: type_seance;
    heureDebut: string;
    heureFin: string;
    idTeacher: Teacher[];
    idSalle: Salles,
    idEmploi: Emplois
    
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