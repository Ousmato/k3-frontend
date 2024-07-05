import { Module } from "./Module";
import { Student } from "./Students";

export interface Students_Module{
    Students: Student;
    modules: Module[]
}