import { Admin } from "./Admin";
import { Ecue, Module } from "./Module";
import { Semestres } from "./Semestre";
import { Inscription, Student } from "./Students";
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
    nom: string;
    prenom: string;
    moyenGeneral: number;
    lieuNaissance: string;
    date_naissance: Date;
}

export interface AddNoteDto{
    idNote: number;
    idModule: number
    noteExam: number;
    noteClasse: number;
    addUeDto: AddUeDto;
}