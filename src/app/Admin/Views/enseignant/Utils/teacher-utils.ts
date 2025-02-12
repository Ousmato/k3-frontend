import { Injectable } from "@angular/core";
import { Diplomes, TeacherGrade } from "../../../Models/Teachers";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Injectable({
    providedIn: 'root',
})
export class TeacherUtils {
    teacherDiplomOptions: {key: string, value: string}[] = [];
    teacher_form!: FormGroup;

    public getGradesOptions() : {key: string , value: string}[]{
        return Object.keys(TeacherGrade).map(key => ({
              key: key,
              value: TeacherGrade[key as keyof typeof TeacherGrade]
            }));
    }
    getDiplomesOptions() : {key: string, value: string}[] {
        const objet = Object.keys(Diplomes).map(key => ({
          
          key: key,
          value: Diplomes[key as keyof typeof Diplomes] 
        }));
        objet.forEach(o => {
          if(o.value != Diplomes.L1 && o.value != Diplomes.L2 ){
            this.teacherDiplomOptions.push(o)
          }
        })
        return objet;
      }

      public InitializeForm(fb: FormBuilder) : FormGroup<any>{
       return this.teacher_form = fb.group({
          idEnseignant: ['', [Validators.required]],
          nom: ['', [Validators.required]],
          prenom: ['', [Validators.required]],
          email: ['', [Validators.email]],
          sexe: ['', [Validators.required]],
          telephone: ['', [Validators.required]],
          dateNaissance: ['', [Validators.required]],
          diplome: ['', [Validators.required]],
          status: ['', [Validators.required]],
          grade: ['', [Validators.required]],
        });
      }
}