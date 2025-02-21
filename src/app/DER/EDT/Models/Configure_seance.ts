import { Emplois } from "./Emplois";
import { Module } from "../../../Admin/Models/Module";
import { Salles } from "../../../Admin/Models/Salles";
import { type_seance } from "./Seances";
import { Participant, Student_group } from "../../../Admin/Models/Students";
import { Teacher } from "../../../Admin/Models/Teachers";

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
    groupes?: Student_group[];
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