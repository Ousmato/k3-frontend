import { Presence } from "./Teacher-presence";

export interface Paie{
    id?: number;
    date?: Date;
    coutHeure: number;
    nbreHeures: number;
    montant?: number;
    idPresenceTeachers: Presence;
}