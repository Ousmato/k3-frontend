import { ClassModules } from "./ClassModule";
import { ClassRoom } from "./Classe";
import { Semestres } from "./Semestre";

export interface Emplois{
    id?:number;
    dateDebut: Date;
    dateFin: Date;
    idClasse: ClassRoom;
    idSemestre: Semestres;
}