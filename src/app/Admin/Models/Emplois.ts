import { Admin } from "./Admin";
import { ClassModules } from "./ClassModule";
import { ClassRoom } from "./Classe";
import { Module } from "./Module";
import { Seances } from "./Seances";
import { Semestres } from "./Semestre";

export interface Emplois{
    id?:number;
    dateDebut: Date;
    dateFin: Date;
    idClasse: ClassRoom;
    idModule: Module;
    idSemestre: Semestres;
    seances?: Seances[]
    progess?: number
    toDay?: boolean
    status?: string
    idAdmin: Admin
}

export interface TeacherEmplois{

    semestre: string;

    niveau: string;

    filiere: string;

    nomModule: string;
    volHoraires: any[]
    semaines: string;

}