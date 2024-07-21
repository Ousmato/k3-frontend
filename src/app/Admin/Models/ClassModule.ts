import { ClassRoom } from "./Classe";
import { Ue } from "./UE";

export interface ClassModules{
    id?: number;
    idStudentClasse: ClassRoom;
    idUE: Ue[];
}