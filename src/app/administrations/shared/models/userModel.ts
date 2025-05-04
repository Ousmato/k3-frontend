export interface userModel {
    id?: number;
    email : string;
    active? : boolean;
    nom: string;
    prenom: string;
    telephone: string;
    urlPhoto ?: string;
    sexe : string;
    matricule?: string;
    usersGrade ? : usersGrade
    nomBanque?: string;
    compteBanque? : string;
}

export interface usersGrade{
    id?: number
    libelle: string
    heureDu: number
}
