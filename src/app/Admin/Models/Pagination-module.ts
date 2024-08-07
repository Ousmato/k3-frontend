import { Notes } from "./Notes";
import { Teacher_presence } from "./objectPresence";
import { Paie } from "./paie";
import { Student } from "./Students";
import { Presence } from "./Teacher-presence";
import { Teacher } from "./Teachers";

export interface TeacherPages{
    content: Teacher[];
    totalElements: number;
    totalPages?: number;
    size: number;
    number: number;
}

export interface StudentPages{
    content: Student[];
    totalElements: number;
    totalPages?: number;
    size: number;
    number: number;

}

export interface NotesPages{
    content: Notes[];
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