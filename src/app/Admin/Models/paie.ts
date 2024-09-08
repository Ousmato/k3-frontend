import { Configure_seance, Journee } from "./Configure_seance";
import { Presence } from "./Teacher-presence";

export interface Paie{
    id?: number;
    date?: Date;
    coutHeure: number;
    coutHeureFormatter?: string;
    nbreHeures: number;
    montant?: number;
    montantFormatter?: string;
    journee: Journee;
}