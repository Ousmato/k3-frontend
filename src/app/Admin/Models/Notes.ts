import { Module } from "./Module";
import { Semestres } from "./Semestre";
import { Student } from "./Students";

export interface Notes{
    id?: number;
    classeNote: number;
    examNote: number;
    idStudents: Student;
    idModule: Module;
    idSemestre: Semestres;
    moyenne?: number;
    rang?: number;
    mension?: string
}

export interface NoteDto{
    nomUE : string;
    modules : NoteModuleDto[];
    noteUE: number;
    coefficientUe: number;
    session : number;
}

export interface NoteModuleDto{
    idModule: number;
    nomModule: string;
    noteModule: number;
    coefficient: number;
}