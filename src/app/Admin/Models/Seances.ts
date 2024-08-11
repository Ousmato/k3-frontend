
import { ClassRoom } from "./Classe";
import { Emplois } from "./Emplois";
import { Module } from "./Module";
import { Salles } from "./Salles";
import { Teacher } from "./Teachers";

export interface Seances{
    id?:number;
    heureDebut: string;
    heureFin: string;
    date?: Date;
    idSalle: Salles;
    observation?: boolean;
    idEmplois: Emplois;
    idTeacher: Teacher;
    idModule: Module;
    plageHoraire?: string[];
    jour?: string;
    pause_matin?: Date;
    pause_midi?: Date;
    date_string?: string;
}

export enum type_seance{
    CM = 'CM',
    TD = 'TD',
    TP = 'TP',
    Examen ='Examen'
}