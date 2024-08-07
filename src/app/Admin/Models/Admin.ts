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
    super_admin = 'admin',
    finance = 'finance',
    secretaire = 'secretaire',
    dg = "dg",
    dga ="dga",
    der = "der",
    scolarite = "scolarite"
}