import { Admin } from "./Admin";

export interface SchoolInfo{
    id?: number;
    nomSchool: string;
    localite: string;
    email: string;
    telephone: number;
    anneeScolaire?: AnneeScolaire
    urlPhoto?: string;
    annee ?: string; 

}
export interface AnneeScolaire{
    id?: number;
    debutAnnee: Date
    finAnnee: Date;
    ans?: number
    idAdmin?: Admin
    nextYear?: number
}