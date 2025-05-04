import { Module } from "../../../Admin/Models/Module"
import { AnneeScolaire } from "../../../Admin/Models/School-info"
import { Teacher } from "../../DER/models/Teachers"

export interface surveillance{
    id?: number
    idTeacher?: Teacher
    idModule: Module
    date: Date
    idAnneeScolaire: AnneeScolaire
    idSurveillant: surveillants

}

export interface surveillants{
    id?: number
    nom: string
    prenom: string
    telephone: string
    active?: boolean
}