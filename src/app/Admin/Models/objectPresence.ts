import { ClassRoom } from "./Classe";
import { Emplois } from "./Emplois";
import { Seances } from "./Seances";
import { Teacher } from "./Teachers";

export interface Teacher_presence{
    id?:number;
    classRoom: ClassRoom[];
    emplois: Emplois[];
    teacher: Teacher;
    seances: Seances [];
}