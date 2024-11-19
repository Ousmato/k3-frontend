import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Inscription, Student } from '../../Models/Students';
import { finalize, Observable } from 'rxjs';
import { Response_String } from '../../Models/Response_String';
import { environment } from '../../../../environments/environment';
import { LoaderService } from '../../../Services/loader.service';

@Injectable({
  providedIn: 'root'
})
export class SinginServiceService {
  private baseUrl = `${environment.apiUrl}api-student/add`;
  constructor(private http: HttpClient, private loadingService: LoaderService) { }

  singIn(student: Inscription, photoFile: File): Observable<Response_String> {
    this.loadingService.loading();
    const formData = new FormData();
    formData.append('inscription', JSON.stringify(student));
   
    formData.append('file', photoFile);
    //  console.log(formData.get('inscription'), formData.get('file'));
    return this.http.post<Response_String>(this.baseUrl, formData).pipe(
      finalize(() => {
        // Arrêter le loader lorsque la requête est terminée
        this.loadingService.stopLoading(); 
      }),
    )
}

}
