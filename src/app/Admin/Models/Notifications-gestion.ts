import { Admin } from "./Admin";
import { Emplois } from "./Emplois";
import { Teacher } from "./Teachers";

export interface Notifications_gestion{ 
     id?: number; 

     date?: Date;
     titre?: string;
     description: string;
    idAdmin?: Admin
     idEmplois?: Emplois
     idTeachers?: Teacher
     idDoc?: string
}