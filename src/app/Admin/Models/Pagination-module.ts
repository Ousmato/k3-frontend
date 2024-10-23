import { Docum, StudentDoc } from "./doc";
import { Notes, StudentsNotesDto } from "./Notes";
import { Teacher_presence } from "./objectPresence";
import { Paie } from "./paie";
import { Inscription, Student } from "./Students";
import { Presence } from "./Teacher-presence";
import { ProfilDto, Teacher } from "./Teachers";

export interface TeacherPages{
    content: ProfilDto[];
    totalElements: number;
    totalPages?: number;
    size: number;
    number: number;
}

export interface StudentPages{
    content: Inscription[];
    totalElements: number;
    totalPages?: number;
    size: number;
    number: number;

}

export interface NotesPages{
    content: StudentsNotesDto[];
    totalElements: number;
    totalPages?: number;
    size: number;
    number: number;
}

export interface Teacher_presence_pages{
    content: Teacher_presence[];
    totalElements: number;
    totalPages?: number;
    size: number;
    number: number;

}
export interface Presence_pages{
    content: Presence[];
    totalElements: number;
    totalPages?: number;
    size: number;
    number: number;
}

export interface Paie_Pages{
    content: Paie[];
    totalElements: number;
    totalPages?: number;
    size: number;
    number: number;
}
export interface Doc_Pages{
    content: StudentDoc[];
    totalElements: number;
    totalPages?: number;
    size: number;
    number: number;
}