import { Component, OnInit } from '@angular/core';
import { Diplomes, ProfilDto, Teacher, TeachersStatus } from '../../Models/Teachers';
import { EnseiService } from '../../Views/enseignant/ensei.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconsService } from '../../../Services/icons.service';
import { PageTitleService } from '../../../Services/page-title.service';
import { SetService } from '../../Views/settings/set.service';
import { Ue } from '../../Models/UE';
import { Filiere } from '../../Models/Filieres';
import { Admin } from '../../Models/Admin';
import { AdminUSER } from '../../Models/Auth';

@Component({
  selector: 'app-teachers-singin',
  templateUrl: './teachers-singin.component.html',
  styleUrl: './teachers-singin.component.css'
})
export class TeachersSinginComponent implements OnInit {

  teacher_form!: FormGroup
  fileName!: File
  teacherStatusOptions!: string[];
  teacherDiplomOptions: { key: string, value: string }[] = []
  filieres: Filiere[] = [];
  filiereNumbers: number[] = [1];
  listFilieresSelect: Filiere[] = []
  count: number = 1
  admin!: Admin
  passwordVisible: boolean = false

  constructor(private enseignantService: EnseiService, private pageTitle: PageTitleService,
    public icons: IconsService, private fb: FormBuilder, private setService: SetService) { }

  ngOnInit(): void {
    this.loa_teacher_form();
    this.load_filieres();
    this.getStatusOptions();
    this.admin = AdminUSER()?.der

  }
  // -------------------------load teacher add form
  loa_teacher_form() {
    this.teacherStatusOptions = Object.values(TeachersStatus);
    this.teacher_form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', Validators.required],
      sexe: ["", Validators.required],
      password: ['', Validators.required],
      telephone: ['', Validators.required],
      // urlPhoto: [''],
      idFiliere1: [''],
      idFiliere2: [''],
      idFiliere3: [''],

      diplome: ['', Validators.required],
      status: ['', Validators.required]
    })
  }

  // -----------------------load all ues
  load_filieres() {
    this.setService.getAll_filiere().subscribe(response => {
      this.filieres = response;

    })

  }
  // -------------------------------

  onFileSelected(event: any) {
    this.fileName = event.target.files[0];
  }
  // --------------------------------password visible
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
  add_teacher() {
    let filiere: Filiere[] = []
    this.filiereNumbers.forEach(fn => {
      filiere.push(this.getFiliereSelectList(fn));
    })
    // console.log(filiere, "filiere------------------")
    const formData = this.teacher_form.value;

    const teacher: Teacher = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      password: formData.password,
      telephone: formData.telephone,
      sexe: formData.sexe,
      status: formData.status,
      diplome: formData.diplome
    }

    const dto: ProfilDto = {
      idAdmin: this.admin,
      teachers: teacher,
      filieres: filiere
    }
    console.log(dto, "dto")
    // return
    if (this.teacher_form.valid) {

      const flieresInvalid = dto.filieres.length === 0 || dto.filieres.some(fl => !fl || !fl.nomFiliere);
      if (flieresInvalid) {
        var erreur = document.getElementById("error") as HTMLElement;
        erreur.style.display = "block";
        return
      } else {
        this.enseignantService.create(dto).subscribe({
          next: (data) => {
            // this.current_enseignat_create = data

            this.pageTitle.showSuccessToast(data.message);
            this.teacher_form.reset();
            this.loa_teacher_form();
           this.filiereNumbers = [1];
           this.count = 1
          },
          error: (erreur) => {
            this.pageTitle.showErrorToast(erreur.error.message);
          }
        })
      }
    } else {
      this.teacher_form.markAllAsTouched();
      console.log("Veuillez remplir tous les champs correctement!", this.teacher_form.value);
    }

  }
  getStatusOptions() {
    const objet = Object.keys(Diplomes).map(key => ({

      key: key,
      value: Diplomes[key as keyof typeof Diplomes]
    }));
    objet.forEach(o => {
      if (o.value != Diplomes.L1 && o.value != Diplomes.L2) {
        this.teacherDiplomOptions.push(o)
      }
    })
  }

  // ----------------incremente and decremente filieres number
  decrement() {
    if (this.count > 1) {
      this.teacher_form.get("idFiliere" + this.count)?.setValue("");
      this.count--;
      this.filiereNumbers.splice(this.count)
      console.log(this.filiereNumbers, "tab ecue after")
    }
  }
  increment() {

    console.log("is cont")
    if (this.count <= 2) {
      this.count++;
      this.filiereNumbers.push(this.count)
      console.log(this.filiereNumbers, "tab ecue")
      // this.getEcues(this.count)
      // this.getFiliereSelectList(this.count)
    }
  }

  getFiliereSelectList(count: number): Filiere {
    const idFiliere = this.teacher_form.get("idFiliere" + count)?.value;
    const fil = this.filieres.find(fl => fl.id == idFiliere);
    console.log(fil, "id filiere")
    return fil!
  }

  onSelect(event: any, index: number) {
    var errorr = document.getElementById('error') as HTMLElement;
    errorr.style.display = "none";
  }
  //  -------------------------------back button
  goBack() {
    window.history.back();
  }
 
}
