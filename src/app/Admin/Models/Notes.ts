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