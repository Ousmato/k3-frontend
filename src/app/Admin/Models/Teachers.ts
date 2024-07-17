export interface Teacher {
    idEnseignant?: number;
    nom: string;
    prenom: string;
    email: string;
    sexe: string;
    password: string;
    telephone: number;
    urlPhoto?: string;
    isDeleted?: boolean;
    status: TeachersStatus;
}

export enum TeachersStatus {
    PEMANENT = 'Permanent',
    PRINCIPAL = 'Principale'
}