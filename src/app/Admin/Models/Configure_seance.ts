import { Seances, type_seance } from "./Seances";
import { Participant } from "./Students";

export interface Configure_seance{
    id?: number;
    idSeance?: Seances;
    idParticipant?: Participant;
    seanceType: type_seance;
    heureDebut: string;
    heureFin: string;
    plageHoraire?: string
    heure?: number;
    munite?: number;
}