import { TypeFilieres } from "./Filieres";

export interface Admin{
    idAdministra?:number;
    nom:string;
    prenom:string;
    email:string;
    telephone:number;
    password:string;
    urlPhoto?: string;
    sexe: string;
    idRole: Roles;
    active?: boolean;
    updateDate?: Date
    
}

export enum Admin_role{
    // ADMINISTRATEUR = 'admin',
    COMPTABLE = 'c',
    SECRETAIRE = 's',
    SECRET_P = 'sp',
    DG = "dg",
    DGA ="dga",
    DER = "der",
    SCOLARITE = "rs"
}

export enum adminEtat{
    ACTIF = 1,
    INACTIF = 0
}

export interface Roles {
    id?: number
    nom: string
    idAdminDg: number
    typeFiliere?: TypeFilieres

}

export interface Poste {
    id?: number
    currentAdmin: Admin
    defaultAdmin: number
    active: boolean
    dateTime: Date
    dateTimeUpdate: Date
    otp?: string
    
}
export interface AdminDto{
    idAdministra?:number;
    nom:string;
    prenom:string;
    email:string;
    telephone:number;

}

export interface validatePassworConfirmCode{
    box1:   string;
    box2: string
    box3: string;
    box4: string

    
}
export interface AdminRoleDto{
    admin: Admin
    roleNames: String[]
}