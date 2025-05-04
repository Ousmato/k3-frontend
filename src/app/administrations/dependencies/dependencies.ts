import { inject, Injectable } from "@angular/core";
import { EnseiService } from "../../Admin/Views/Enseignant/ensei.service";
import { SalleService } from "../../Services/salle.service";
import { SideBarService } from "../../sidebar/side-bar.service";
import { EtudeService } from "../../Admin/Views/Etudiants/etude.service";
import { SeancService } from "../../DER/EDT/Services/seanc.service";
import { IconsService } from "../../Services/icons.service";
import { ActivatedRoute, Router } from "@angular/router";
import { returnMessages } from "../shared/utils/returnMessages";
import { FormBuilder } from "@angular/forms";
import { SurveillenceService } from "../SP/services/surveillence.service";
import { ServiceService } from "../../DER/EDT/Services/service.service";
import { utils } from "../shared/utils/utils";
import { Enumerateds } from "../shared/utils/enumerateds";
import { GroupeService } from "../../Services/groupe.service";
import { PromotionServiceService } from "../shared/services/promotion-service.service";
import { TeacherUtils } from "../DER/utils/teacher-utils";
import { ClassStudentService } from "../../DGA/class-students/class-student.service";
import { SemestreService } from "../../Services/semestre.service";
import { DatePipe } from "@angular/common";
import { LoaderService } from "../../Services/loader.service";
import { AuthServiceService } from "../../auth-service.service";
import { AdminService } from "../../Services/admin.service";
import { InscriptionService } from "../../Services/inscription.service";

@Injectable({
    providedIn : "root"
})
export class contructor_dependencies{

    // app services dependencies
     public teacherService = inject(EnseiService)
      public salleService = inject(SalleService)
      public sideBareService = inject(SideBarService)
      public studentService = inject(EtudeService)
      public adminService = inject(AdminService)
      public seanceService = inject(SeancService)
      public classService = inject(ClassStudentService)
      public semestreService = inject(SemestreService)
      public inscriptionService =  inject(InscriptionService)
      public icons = inject(IconsService);
      public util = inject(utils);
      public loaderService = inject(LoaderService)
      public teacher_util = inject(TeacherUtils);
      public enumerateds = inject(Enumerateds)
      public authService = inject(AuthServiceService)
      public studentGroupeService = inject(GroupeService)
      public promotionService = inject(PromotionServiceService)

      public surveillance = inject(SurveillenceService)
      public queryreturnMessage = inject(returnMessages)
      public emploiService = inject(ServiceService)


    //angular dependencies
      public root = inject(ActivatedRoute)
      public router = inject(Router)
      public fb = inject(FormBuilder)
      public datePipe = inject(DatePipe)

}