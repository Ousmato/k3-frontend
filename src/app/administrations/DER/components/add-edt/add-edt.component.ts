import { Component, inject, OnInit } from '@angular/core';
import { contructor_dependencies } from '../../../dependencies/dependencies';
import { AnneeScolaire } from '../../../../Admin/Models/School-info';
import { Semestres } from '../../../../Admin/Models/Semestre';
import { FormGroup, Validators } from '@angular/forms';
import { Module } from '../../../../Admin/Models/Module';
import { ClassRoom } from '../../../../Admin/Models/Classe';
import { Emplois } from '../../models/Emplois';
import { Admin } from '../../../shared/models/Admin';
import { getUser } from '../../../shared/models/auth';

@Component({
  selector: 'app-add-edt',
  templateUrl: './add-edt.component.html',
  styleUrl: './add-edt.component.css'
})
export class AddEDTComponent implements OnInit {
  form!: FormGroup
  semestre: Semestres[] = []
  modules: Module[] = []
  promotions: AnneeScolaire[] = []
  classes: ClassRoom[] = []
  idClasse: number | null = null
  formattedDateFin: any;
  classRoom!: ClassRoom;
  admin!: Admin
  is_reondly: boolean = false
  public dependencies = inject(contructor_dependencies)

  ngOnInit(): void {
    this.admin = getUser()
    this.getAllPromotions()
    this.load_form()

    this.form.get('idClasse')?.disable()
    this.form.get('idSemestre')?.disable()
    this.form.get('idModule')?.disable()

  }


  getAllPromotions() {
    this.dependencies.promotionService.getAll_annee().subscribe(res => {
      this.promotions = res
      console.log(this.promotions, "promotions")
    })
  }

  onPromotionSelect(event: any) {
    this.classes = []
    const promotionid = event.target.value;
    this.dependencies.classService.getAllClasse(promotionid, this.admin.id!).subscribe(res => {
      this.classes = res
      console.log(this.classes, "classes")
      this.form.get('idClasse')?.enable()

    })
  }
  onClasseSelect(event: any) {
    this.semestre = []
    this.idClasse = event.target.value;
    this.loadSemestre(this.idClasse!)
    this.form.get('idSemestre')?.enable()
  }

  //get all semestre of classroom
  loadSemestre(idClasse: number) {
    this.dependencies.semestreService.getCurrentSemestresByIdNivFiliere(idClasse!).subscribe((response: Semestres[]) => {
      response.forEach(sm => {
        if (!this.semestre.some(s => s.id == sm.id)) {
          this.semestre.push(sm)
        }
      });
      console.log(this.semestre);
    })
  }

  load_form() {
    this.form = this.dependencies.fb.group({
      idAnnee: ['', Validators.required],
      idSemestre: ['', Validators.required],
      idClasse: ['', Validators.required],
      idModule: ['', Validators.required],
      // seanceType: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: [{ value: '', disabled: true }]
    })
  }

  loadModulesByClass(idClasse: number, idSemestre: number): void {
    this.dependencies.classService.getAllModulesByClasseAndSemestre(idClasse, idSemestre).subscribe((data: Module[]) => {
      this.modules = data;
      console.log(this.modules, "modules");

    })

  }

  onSemestreSelect(event: any) {
    this.modules = []
    const semestreId = event.target.value;
    this.loadModulesByClass(this.idClasse!, semestreId)
    this.form.get('idModule')?.enable()
  }

  check_date(event: any) {
    const dateDebu = event.target.value;

    const dateDebut = new Date(dateDebu!);
    console.log(dateDebut, "dateDebut")
    const dateFin = new Date(dateDebut);
    dateFin.setDate(dateDebut.getDate() + 5);
    this.formattedDateFin = this.dependencies.datePipe.transform(dateFin, 'yyyy-MM-dd');

    this.form.get('dateFin')?.setValue(this.formattedDateFin);
    // console.log(this.EmploisAdd.value, this.formattedDateFin, "000000000000000")
    // this.datesWithDays = this.emploisService.getDaysBetweenDates(dateDebu, this.formattedDateFin);
    // // console.log(this.datesWithDays, "dates days component")
    // this.datesWithDays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    // this.sortByDay()
    // this.is_showJour = true
  }

  submit() {
    if (this.form.valid) {
      const formData = this.form.value;


      const module = this.modules.find(mod => mod.id == formData.idModule);
      this.classRoom = this.classes.find(cl => cl.id == formData.idClasse)!;
      const {specialites,... newClasse} = this.classRoom
      // console.log("idSemestre", formData.idSemestrete)

      const semestre: Semestres = this.semestre.find(sm => sm.id == formData.idSemestre)!;
      const emplois: Emplois = {
        idSemestre: semestre,
        idModule: module!,
        dateDebut: formData.dateDebut,
        dateFin: this.formattedDateFin,
        idClasse: newClasse!,
        idAdmin: this.admin

      }
      console.log("emplois", emplois)
      // return
      this.dependencies.emploiService.addEmplois(emplois).subscribe({
        next: (result) => {
          this.dependencies.queryreturnMessage.showSuccessToast(result.message);
          this.form.reset();
          this.load_form()
          this.form.get('idClasse')?.disable()
          this.form.get('idSemestre')?.disable()
          this.form.get('idModule')?.disable()

        },
        error: (err) => {
          this.dependencies.queryreturnMessage.showErrorToast(err.error.message);
        }
      })
    } else {
      this.form.markAllAsTouched();
      console.log(this.form.value);
    }
  }
}
