
import { Emplois } from "./Emplois";
import { Module } from "./Module";
import { Teacher } from "./Teachers";

export interface Seances{
    id?:number;
    heureDebut: string;
    heureFin: string;
    date: Date;
    idEmplois: Emplois;
    idTeacher: Teacher;
    idModule: Module;
    jour?: string;
}