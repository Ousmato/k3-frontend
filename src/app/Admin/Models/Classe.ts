import { NivFiliere } from "./NivFiliere";

export interface ClassRoom{
    id?:number;
    effectifs: number;
    scolarite: number;
    idFiliere?: NivFiliere

}