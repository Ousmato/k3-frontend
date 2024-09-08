import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Teacher } from '../../../Admin/Models/Teachers';
import { EnseiService } from '../../../Admin/Views/enseignant/ensei.service';
import { SalleService } from '../../../Services/salle.service';
import { Salles } from '../../../Admin/Models/Salles';
import { Jury, Jury_role, Soutenance } from '../../../Admin/Models/doc';
import { IconsService } from '../../../Services/icons.service';
import { ActivatedRoute } from '@angular/router';
import { EtudeService } from '../../../Admin/Views/etudiants/etude.service';
import { PageTitleService } from '../../../Services/page-title.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-program-soutenance',
  templateUrl: './program-soutenance.component.html',
  styleUrl: './program-soutenance.component.css'
})
export class ProgramSoutenanceComponent implements OnInit{

  prog_form!: FormGroup
  @Input() idDoc!: number |null
  @Output() closeModal = new EventEmitter<any>();
  teachers: Teacher [] = []
  salles: Salles [] = []
  numberJury: any[]=[1,2,3]

  jury: Jury [] = []
  soutenance!: Soutenance
usedTeachers: Set<{teacher: number, role: string}> = new Set();
  juryRole: {key: string, value: string}[] = []
  constructor(private fb: FormBuilder, private teacherService: EnseiService, private datePipe: DatePipe,
    private pageTitle: PageTitleService,
    private studentService: EtudeService,
    private root: ActivatedRoute,
    public icons: IconsService,
    private salleService: SalleService){}

  ngOnInit(): void {
    this.loa_form();
    this.getAllTeacher();
    this.getAllSalles();
    this.getTypesOptions()
      
  }

  // --------------------------load form
  loa_form(){
    this.prog_form = this.fb.group({
      idDoc: ['', Validators.required],
      date: ['', Validators.required],
      heureDebut: ['', Validators.required],
      heureFin: ['', Validators.required],
      idSalle: ['', Validators.required],
      idTeacher: ['',Validators.required],
      idTeacher0: ['',Validators.required],
      idTeacher1: ['', Validators.required],
      idTeacher2: ['', Validators.required],
      role0: ['',Validators.required],
      role1: ['', Validators.required],
      role2: ['', Validators.required]
    })
  }
  submit(){
    const formData = this.prog_form.value
    let teacher : Teacher
    const idSalle = this.salles.find(sl => sl.id == formData.idSalle);
    const idTeacher = this.teachers.find(tch => tch.idEnseignant == formData.idTeacher);
    

    this.usedTeachers.forEach(jr => {
      teacher = this.teachers.find(t => t.idEnseignant == jr.teacher)!;
      const jury : Jury ={
      role: jr.role,
      idTeacher: teacher!

    }
    this.jury.push(jury)
    console.log(jury, "jury")
    
     this.soutenance ={
      date:formData.date,
      heureDebut: formData.heureDebut,
      heureFin: formData.heureFin,
      idDoc: formData.idDoc,
      idSalle: idSalle!,
      idTeacher: idTeacher!,
      idJury: this.jury
    }
    })

    if(this.prog_form.valid){
      console.log("soutenance : ", this.soutenance)
      this.studentService.createSoutenance(this.soutenance).subscribe({
        next: (result) => {
         this.pageTitle.showSuccessToast(result.message);
         this.prog_form.reset();
         this.loa_form();
         this.usedTeachers.clear();
        },
        error: (error) => {
         this.pageTitle.showErrorToast(error.error.message);
         this.prog_form.reset();
         this.loa_form();
         this.usedTeachers.clear();
        }


      })
    }else{
      this.prog_form.markAllAsTouched();
      console.log(this.prog_form.value, "inavlid")
    }

  }
  // --------------------------get all teachers
  getAllTeacher(){
    this.teacherService.getAll().subscribe((data) => {
      this.teachers = data;
    })
  }
  // --------------------------get all salles
  getAllSalles(){
    this.root.queryParams.subscribe(param => {
      this.idDoc = param['id'];
      this.prog_form.get('idDoc')?.setValue(this.idDoc);
    })
    this.salleService.getAll().subscribe((data) => {
      this.salles = data;
    })
  }

  getTypesOptions() {
    const objet = Object.keys(Jury_role).map(key => ({
      
      key: key,
      value: Jury_role[key as keyof typeof Jury_role] 
    }));
    objet.forEach(o => {
        this.juryRole.push(o)
      
    })
  }
  // -----------------------go back
  goBack(){
    window.history.back()
  }
  isTeacherSelected(teacherId: number): boolean {
    return Array.from(this.usedTeachers).some(item => item.teacher === teacherId);
  }
  
  onTeacherChange(event: any, index: number) {
    const idTeacher = event.target.value;
    const role = this.prog_form.get('role' + index)?.value;
  
    // Remove the previously selected teacher (if any) for this index
    const previousTeacher = Array.from(this.usedTeachers).find(item => item.teacher === this.prog_form.get('idTeacher' + index)?.value);
  
    if (previousTeacher) {
      this.usedTeachers.delete(previousTeacher);
    }
  
  // Ajouter l'enseignant si à la fois l'enseignant et le rôle sont sélectionnés
    if (idTeacher && role) {
      this.usedTeachers.add({ teacher: idTeacher, role: role });
      console.log(this.usedTeachers, "Selected teachers with roles");
    }
  }


onRoleChange(event: any, index: number) {
  const role = event.target.value;
  const idTeacher = this.prog_form.get('idTeacher' + index)?.value;

  // If both teacher and role are available, update the usedTeachers set
  if (idTeacher && role) {
    // Remove the previous entry for this teacher
    const previousTeacher = Array.from(this.usedTeachers).find(item => item.teacher === idTeacher);
    if (previousTeacher) {
      this.usedTeachers.delete(previousTeacher);
    }

    // Add the teacher with the new role
    this.usedTeachers.add({ teacher: idTeacher, role: role });
    console.log(this.usedTeachers, "Selected teachers with updated roles");
  }
}

// ------------------------calculate hours
  calculateHours(): number {
    const debut = new Date(this.prog_form.get('heureDebut')?.value);
    // Ajouter 45 minutes à l'heure de début
    const fin = new Date(debut);
    fin.setMinutes(debut.getMinutes() + 45);

    // Calculer la différence en millisecondes
    const diff = fin.getTime() - debut.getTime();

    // Convertir la différence en heures (si nécessaire, sinon vous pouvez calculer en minutes)
    const hours = diff / (1000 * 60 * 60);
    return hours;
  }

  heureChange(event : any){
   const heureDebut = event.target.value
    const date = new Date();
    // Calculer les heures de fin en ajoutant 45 minutes à l'heure de début
    const [hours, minutes] = heureDebut.split(':').map(Number);

    // Créer un objet Date avec l'heure de début
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    const fin = new Date(date);
    fin.setMinutes(fin.getMinutes() + 45);

   const time = this.datePipe.transform(fin, "HH:mm");
    console.log(time, "hours");

    this.prog_form.get('heureFin')?.setValue(time);
  }
}
