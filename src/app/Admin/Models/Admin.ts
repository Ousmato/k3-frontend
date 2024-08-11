export interface Admin{
    idAdministra?:number;
    nom:string;
    prenom:string;
    email:string;
    telephone:number;
    password:string;
    urlPhoto?: string;
    sexe: string;
    role: Admin_role;
    
}

export enum Admin_role{
    ADMINISTRATEUR = 'admin',
    COMPTABLE = 'comptable',
    SECRETAIRE = 'secretaire',
    DG = "dg",
    DGA ="dga",
    DER = "der",
    SCOLARITE = "scolarite"
}