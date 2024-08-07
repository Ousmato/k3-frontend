
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
    dates?: Date[];
    idSalle: Salles;
    observation?: boolean;
    idEmplois: Emplois;
    idTeacher: Teacher;
    idModule: Module;
    idClasse?: ClassRoom;
    jour?: string;
    date_string?: string;
}