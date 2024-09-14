import { AnneeScolaire } from "./School-info";

export interface Semestres{
    id?:number;
    nomSemetre:string;
    dateDebut: Date;
    datFin: Date;
    idAnneeScolaire: AnneeScolaire
    
}

export enum SemestreName{
    S1 = "SEMESTRE 1",
    S2 = "SEMESTRE 2",
    S3 = "SEMESTRE 3",
    S4 = "SEMESTRE 4",
    S5 = "SEMESTRE 5",
}
