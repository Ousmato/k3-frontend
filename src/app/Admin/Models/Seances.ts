
import { Journee } from "./Configure_seance";
import { Emplois } from "./Emplois";
import { Module } from "./Module";

export interface Seances{
    id?:number;
    heureDebut: string;
    heureFin: string;
    date?: Date;
    observation?: boolean;
    idEmplois: Emplois;
    // idTeacher: Teacher;
    idModule: Module;
    plageHoraire?: string[];
    jour?: string;
    pause_matin?: Date;
    pause_midi?: Date;
    date_string?: string;
}

export enum type_seance{
    CM = 'cm',
    TD = 'td',
    TP = 'tp',
    Examen ='examen',
    SESSION = "session"
}
