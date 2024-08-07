export interface Teacher {
    numero?: number;
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
    PEMANENT = 'Vacataire',
    PRINCIPAL = 'Permanent'
}