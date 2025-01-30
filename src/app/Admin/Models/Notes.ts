import { Admin } from "./Admin";
import { Ecue, Module } from "./Module";
import { Semestres } from "./Semestre";
import { Inscription, InscriptionNoteDto, Student } from "./Students";
import { AddUeDto, Ue } from "./UE";

export interface Notes{
    id?: number;
    classeNote: number;
    examNote: number;
    idInscription: Inscription;
    idAdmin: Admin
    idModule: Ecue;
    idSemestre: Semestres;
    moyenne?: number;
    rang?: number;
    mension?: string
}

export interface NoteDto{
    nomUE : string;
    idUe: number;
    modules : NoteModuleDto[];
    noteUE: number;
    coefficientUe: number;
    session : number;
    noteUeCoefficient: number;
}
export interface GetNoteDto{
    idNote: number;
    ues : UeDto;
    moyenUe: number;
    coefUe: number
    session : number;
    moyenGeneral: number;
}

export interface UeDto{
    id: number;
    code: string
    nomUE: string
    modules: Module[];
}
export interface NoteModuleDto{
    idModule: number;
    idUe: number;
    nomModule: string;
    noteModule: number;
    coefficient: number;
}

export interface StudentsNotesDto{
    noteDTO: GetNoteDto[];
    id: number;
    nom: string;
    prenom: string;
    moyenGeneral: number;
    lieuNaissance: string;
    date_naissance: string;
    sexe: string
}

export interface AddNoteDto{
    idNote: number;
    idModule: number
    examNote: number;
    classeNote: number;
    noteUe: number
    validate: string
    sessionNote: number
    nbreSession: number
    inscriptions: InscriptionNoteDto
}

export interface StudentMoyenne{
    moyenGenerale: number
    idInscription: Inscription
    idSemestre: Semestres
}