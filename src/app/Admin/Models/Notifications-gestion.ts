import { Admin } from "../../administrations/shared/models/Admin";
import { Emplois } from "../../administrations/DER/models/Emplois";
import { Teacher } from "../../administrations/DER/models/Teachers";

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