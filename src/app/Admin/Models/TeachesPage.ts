import { Student } from "./Students";
import { Teacher } from "./Teachers";

export interface TeacherPages{
    content: Teacher[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface StudentPages{
    content: Student[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;

}