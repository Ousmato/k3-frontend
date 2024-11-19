import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClassStudentService } from '../../../DGA/class-students/class-student.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetService } from '../../../Admin/Views/settings/set.service';
import { ClassRoom } from '../../../Admin/Models/Classe';
import { Semestres } from '../../../Admin/Models/Semestre';
import { AddUeDto, Ue } from '../../../Admin/Models/UE';
import { PageTitleService } from '../../../Services/page-title.service';
import { SemestreService } from '../../../Services/semestre.service';
import { IconsService } from '../../../Services/icons.service';
import { FiliereNiveau } from '../../../Admin/Models/Filieres';
import { Admin } from '../../../Admin/Models/Admin';
import { AdminUSER } from '../../../Admin/Models/Auth';

@Component({
  selector: 'app-add-ue',
  templateUrl: './add-ue.component.html',
  styleUrl: './add-ue.component.css'
})
export class AddUeComponent implements OnInit {

  addUe!: FormGroup
  admin!: Admin
  classes: ClassRoom[] = []
  semestres: Semestres[] = []
  oldUes: Ue[] = []

  count: number = 1
  ecueNumbers: number[] = [1]
  ecues: Set<{ nomModule: string, coefficient: number }> = new Set();
  isOldUe: boolean = false
  isEcue: boolean = false
  error: boolean = false
  @Output() closeModale = new EventEmitter<any>()
  @Input() classe!: ClassRoom


  constructor(private classService: ClassStudentService, public icons: IconsService,
    private semestreService: SemestreService,
    private fb: FormBuilder, private setService: SetService, private pageTitle: PageTitleService) { }

  ngOnInit() {
    this.load_formAdd();
    this.load();
    this.admin = AdminUSER()?.scolarite;
  }

  load_formAdd() {

    this.addUe = this.fb.group({
      nomUE: ['', [Validators.required, Validators.maxLength(40)]],
      idClasse: ["", Validators.required],
      idSemestre: ['', Validators.required],

      nomModule3: ['', [Validators.maxLength(40)]],
      nomModule1: ['', [Validators.maxLength(40)]],
      nomModule2: ['', [Validators.maxLength(40)]],
      coefficient3: ['', [Validators.min(1), Validators.max(10)]],
      coefficient1: ['', [Validators.min(1), Validators.max(10)]],
      coefficient2: ['', [Validators.min(1), Validators.max(10)]],
    })
    this.addUe.get("idClasse")?.setValue(this.classe.id)

  }

  // -----------------add ue
  creatUe() {
    this.ecueNumbers.forEach(ec => {
      this.getEcues(ec);
    })
    const formData = this.addUe.value;
    const semestre = this.semestres.find(sem => sem.id == formData.idSemestre)

    const ue: Ue = {
      nomUE: formData.nomUE,
      idAdmin: this.admin
    }
    const dto: AddUeDto = {
      idClasse: formData.idClasse!,
      semestre: semestre!,
      idUe: ue,
      modules: Array.from(this.ecues),
    }
    console.log(dto, "dto", formData, "formData");
    // return
    if (this.addUe.valid) {

      console.log(dto.modules, "module")
      const modulesInvalid = dto.modules.length === 0 || dto.modules.some(module => !module.nomModule || !module.coefficient);

      if (modulesInvalid) {
        var errorr = document.getElementById('error') as HTMLElement;
        errorr.style.display = "block";
        return;

      } else {
        this.setService.createUe(dto).subscribe({
          next: (response) => {
            this.pageTitle.showSuccessToast(response.message);
            this.addUe.reset();
            this.load_formAdd();
            this.ecues = new Set<any>();
            this.ecueNumbers = [1]
            this.count = 1
            // this.load_ues();

          },
          error: (erreur) => {
            this.pageTitle.showErrorToast(erreur.error.message + "Erreur")
            this.ecues = new Set<any>();
            this.ecueNumbers = [1]
            this.count = 1
          }
        })
      }

    } else {
      this.addUe.markAllAsTouched();
      console.log(this.addUe.value, "invalid");
    }

  }

  // -----------------------to touch input
  onTouch(event: any) {
    var errorr = document.getElementById('error') as HTMLElement;

    errorr.style.display = "none";
  }
  getAllUeByIdClasse(id: number) {
    this.classService.getAllUeByIdClasse(id).subscribe(result => {
      this.oldUes = result
    })
  }

  // --------------------------------
  load() {

    this.semestreService.getCurrentSemestresOfYear().subscribe(result => {
      result.forEach(sem => {
        // Vérifier si le semestre n'est pas déjà dans la liste
        if (!this.semestres.some(s => s.id === sem.id)) {

          // Filtrer les semestres en fonction du niveau de la classe
          if (this.classe.idFiliere?.idNiveau.nom === FiliereNiveau.L1.toString()) {
            // L1 correspond à S1 et S2
            if (sem.nomSemetre === "S1" || sem.nomSemetre === "S2") {
              this.semestres.push(sem);
            }
          } else if (this.classe.idFiliere?.idNiveau.nom === FiliereNiveau.L2.toString()) {
            // L2 correspond à S3 et S4
            if (sem.nomSemetre === "S3" || sem.nomSemetre === "S4") {
              this.semestres.push(sem);
            }
          } else if (this.classe.idFiliere?.idNiveau.nom === FiliereNiveau.L3.toString()) {
            // L3 correspond à S5
            if (sem.nomSemetre === "S5") {
              this.semestres.push(sem);
            }
          }
        }
      });

      console.log(this.semestres, "semestre");
    });


  }

  // ------------------------------
  decrement() {
    if (this.count > 1) {
      this.count--;
      this.ecueNumbers.splice(this.count)
      console.log(this.ecueNumbers, "tab ecue after")
    }
  }
  increment() {

    console.log("is cont")
    if (this.count <= 2) {
      this.count++;
      this.ecueNumbers.push(this.count)
      console.log(this.ecueNumbers, "tab ecue")
      // this.getEcues(this.count)
    }
  }

  getEcues(count: number) {
    const coef = this.addUe.get("coefficient" + count)?.value;
    const module = this.addUe.get("nomModule" + count)?.value;

    // Ajouter à l'ensemble seulement si les deux valeurs sont définies
    if (module !== undefined && coef !== undefined) {
      this.ecues.add({ nomModule: module, coefficient: coef });
      console.log(this.ecues, "ECUEs récupérés");
    } else {
      console.log("Erreur : Valeur manquante pour l'index", count);
    }
  }
  show_old_ues() {
    this.isOldUe = !this.isOldUe;

  }

  close_add() {
    this.closeModale.emit();
  }

}
