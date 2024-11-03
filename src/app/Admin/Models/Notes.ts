import { Admin } from "./Admin";
import { Ecue, Module } from "./Module";
import { Semestres } from "./Semestre";
import { Inscription, Student } from "./Students";
import { AddUeDto } from "./UE";

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

export interface NoteModuleDto{
    idModule: number;
    idUe: number;
    nomModule: string;
    noteModule: number;
    coefficient: number;
}

export interface StudentsNotesDto{
    noteDTO: NoteDto[];
    nom: string;
    prenom: string;
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