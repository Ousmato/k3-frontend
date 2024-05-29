export interface Teacher {
    idEnseignant: number;
    nomTeacher: string;
    prenom: string;
    email: string;
    password: string;
    telephone: number;
    urlPhoto: string;
    // isDeleted: boolean;
    status: TeachersStatus;
}

export enum TeachersStatus {
    // Définir les différents statuts possibles des enseignants
    // Par exemple :
    ACTIVE = 'Active',
    INACTIVE = 'Inactive',
    PENDING = 'Pending'
}