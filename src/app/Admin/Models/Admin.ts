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
    active?: boolean;
    updateDate?: Date
    
}

export enum Admin_role{
    // ADMINISTRATEUR = 'admin',
    COMPTABLE = 'comptable',
    SECRETAIRE = 'secretaire',
    DG = "dg",
    DGA ="dga",
    DER = "der",
    SCOLARITE = "scolarite"
}

export enum adminEtat{
    ACTIF = 1,
    INACTIF = 0
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

// Implémentation de l'interface
class PasswordConfirmCode  {
    box1: string;
    box2: string;
    box3: string;
    box4: string;

    constructor(box1: string, box2: string, box3: string, box4: string) {
        this.box1 = box1;
        this.box2 = box2;
        this.box3 = box3;
        this.box4 = box4;
    }

    // Méthode qui concatène les valeurs
    getResult(): string {
        return this.box1 + this.box2 + this.box3 + this.box4; // "6215"
    }
}