import { Seances } from "./Seances";

export interface Presence{
    id?:number;
    idSeance: Seances;
    observation?: boolean;
    heure?: number;
    munite?: number;
}