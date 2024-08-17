import { ClassModules } from "./ClassModule";
import { ClassRoom } from "./Classe";
import { Seances } from "./Seances";
import { Semestres } from "./Semestre";

export interface Emplois{
    id?:number;
    dateDebut: Date;
    dateFin: Date;
    idClasse: ClassRoom;
    idSemestre: Semestres;
    seances?: Seances[]
}