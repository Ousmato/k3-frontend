import { Admin } from "../../../Admin/Models/Admin";
import { ClassRoom } from "../../../Admin/Models/Classe";
import { Module } from "../../../Admin/Models/Module";
import { Seances } from "./Seances";
import { Semestres } from "../../../Admin/Models/Semestre";

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