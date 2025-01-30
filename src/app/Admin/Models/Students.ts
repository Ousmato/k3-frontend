import { Admin } from "./Admin";
import { ClassRoom } from "./Classe";
import { AnneeScolaire } from "./School-info";

export interface Student {
    numero?: number;
    idEtudiant?: number;
    nom: string;
    prenom: string;
    sexe: string;
    email: string;
    scolarite?: number;
    // payer?: boolean;
    telephone: string;
    password: string;
    active?: boolean;
    urlPhoto?: string;
    matricule: string;
    lastNameFather: string; 
    lieuNaissance: string;
    dateNaissance: string; 
    motherName: string; 
    commNaissance: string; 
    cercleNaissance: string; 
    nationalite: string; 
    residenceParent: string; 

    diplome: Diplome; 
    academies: Accademies; 
    series: seriesType; 
    quartier: Quartier; 

    numeroPlace: number
    anneeObtention: number
    
    // idClasse ?: ClassRoom;
    // idAdmin?: Admin;
    // modules?: Module[]
    status: Type_status;
}

export interface Student_reinscription{
    idStudent: number;
    idClasse: number;
    idAnnee: number
}

export enum Type_status{
    REGULIER = "REGULIER",
    PROFESSIONNEL_ETAT = "PROFESSIONNEL D'ETAT",
    PROFESSIONNEL_COLLECTIVITE = "PROFESSIONNEL DE COLLECTIVITE",
    PROFESSIONNEL_PRIVEE = "PROFESSIONNEL PRIVEE",
    FORMATION_CONTINUE = "FORMATION CONTINUE",
    CANDIDAT_LIBRE = "CANDIDAT LIBRE",
   
}

export interface Student_group{
    id?: number;
    nom: string;
    idEmploi: number;
}
export interface  InscriptionNoteDto
{
    id?: number;
    nom: string;
    prenom: string;
    lieuNaissance: string
    dateNaissance: string
    idClasse: ClassRoom;
    sexe: string
    ueValidate: UeValidateDto[]

}

export interface UeValidateDto{
    nomSemestre : string;
    observation: string;
    moyenSemestre: string;
    percentUeSemestre: string;
}
export interface Participant{
    id?: number;
    idStudentGroup: Student_group;
    idInscription: Inscription
    idAdmin: Admin

}

export interface StudentGroupDto{
    id?: number;
    nom: string;
    nomModule: string;
    classe: string;
    annee: AnneeScolaire
    semestre: string;
    inscriptions: InscriptionNoteDto[]
}

export interface Student_count{
    inscrit: number;
    non_inscrit: number;
}

export interface Student_import {
    idClasse: number;
    idAnnee: number;
    scolarite?: number
    students: Student[]
}

export enum StudentEtat{
    Inscrits = 1,
    Non_inscrit = 0,
    Tout = "tout"
}

export interface Inscription{
    id?: number;
    idEtudiant: Student
    idClasse: ClassRoom
    idAdmin: Admin
    date?: Date
    active?: boolean;
    payer?: boolean
    scolarite?: number
    numeroInscrit?: number
    // idFiliere?: number

}
export interface montantsCount {
    sumScolariteReg: number,
    sumScolaritePro: number,
    sumScolariteTotal: number,
    reliquatReg: number,
    reliquatPro: number,
    reliquatTotal: number
}

export enum Accademies{
    KAYES = "Kayes",
    KENIEBA = "KENIEBA",
    KITA = "KITA",
    NIORO = "NIORO",
    KOULIKORO = "KOULIKORO",
    KATI = "KATI",
    KALABANCORO = "KALABANCORO",
    NARA = "NARA",
    DIOILA = "DIOILA",
    SIKASSO = "SIKASSO",
    BOUGOUNI = "BOUGOUNI",
    KOUTIALA = "KOUTIALA",
    SEGOU = "SEGOU",
    SAN = "SAN",
    MOPTI = "MOPTI",
    TENENKOU = "TENENKOU",
    DOUENTZA = "DOUENTZA",
    BANDIAGARA = "BANDIAGARA",
    TOMBOUCTOU = "TOMBOUCTOU",
    GOURMA_RHAROUS = "GOURMA RHAROUS",
    GAO = "GAO",
    KIDAL = "KIDAL",
    MENAKA = "MENAKA",
    TAOUDENIT = "TAOUDENIT",
    BAMAKO_RIVE_GAUCHE = "BAMAKO RIVE GAUCHE",
    BAMAKO_RIVE_DROITE = "BAMAKO RIVE DROITE",

}

export enum seriesType {
    
    //lycee
    TSECO = "TSECO",
    TSS = "TSS",
    TSEXP ="TSEXP",
    TSE = "TSE",
    TLL = "TLL",
    TALL = "TALL",

    //lycce technique
    Gestion_Commerce = "GESTION COMMERCE",
    Genie_Civil = "GENIE CIVILE",
    Genie_Mecanique = "GENIE MECANIQUE",
    Genie_ELectrique = "GENIE ELECTRIQUE",
    Comptabilite_Finance = "COMPTABILITE FINANCES",

    //diplome professionnelle
    Technique_Comptable = "TECHNIQUE COMPTABLE",
    Secretaria_Direction = "SECRETARIA DE DIRECTION",
    Dessin_Batiment = "DESSIN BATTIMENT",
    Batiment = "BATIMENT",
    ELectricite = "ELECTRICITE",
    ELECTROMECANIQUE = "ELECTRO MECANIQUE",

}

export enum Quartier {
    SEBOUGOU = "SEBOUGOU",
    ANGOULEM = "ANGOULEM",
    SONIKOURA = "SONIKOURA",
    LAFIABOUGOU = "LAFIABOUGOU",
    MISSIRA = "MISSIRA",
    ATTBOUGOU = "ATTBOUGOU",
    MEDINE = "MEDINE",
    DARSALAM = "DARSALAM",
    SOMONOSSO = "SOMONOSSO",
    PELENGANA = "PELENGANA",
    BAGADAJI = "BAGADAJI",
}

export enum Diplome{
    BAC = "BAC",
    DUT = "DUT",
    BT2 = "BT2",
}

export interface Dto_scolarite{
    id? : number
    scolarite: number
    payer: number
    reliquat: number
}