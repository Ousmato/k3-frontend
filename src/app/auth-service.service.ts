import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, map, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { LoaderService } from './Services/loader.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private authUrl = `${environment.apiUrl}Auth/login`;

  constructor(private http : HttpClient, private loadingService: LoaderService, private router: Router) { }


  login(email: string, password: string): Observable<any> {
    this.loadingService.loading();
    return this.http.post<any>(this.authUrl, { email, password }).pipe(
      
      map(response => {
      // Vérifier si le token existe dans la réponse
      if (response && response.token) {
        // Stocker le token dans le localStorage
        console.log(response, "response")
        sessionStorage.setItem('authToken', response.token);
        sessionStorage.setItem('refreshToken', response.refreshToken);
        sessionStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    }),
    finalize(() => this.loadingService.stopLoading()), // Arrêter le chargement lorsque la requête est terminée
    catchError(error => {
      console.error('Error during login:', error);
      return throwError(error); // Propager l'erreur à l'appelant
    })
  );
  }


  logout() {
   sessionStorage.clear();
   this.router.navigate(['']);
  }

  // Méthode pour vérifier si l'utilisateur est actuellement authentifié
  isLoggedIn(): boolean {
    console.log( sessionStorage.getItem('user') != null)
    return sessionStorage.getItem('user') != null
    // return sessionStorage.getItem('admin') != null || sessionStorage.getItem('der') != null || sessionStorage.getItem('dga') != null || sessionStorage.getItem('dg') != null
    //  || sessionStorage.getItem('comptable') != null || sessionStorage.getItem('scolarite') != null || sessionStorage.getItem('secretaire') != null; // Exemple : vérifie si un jeton est présent dans le stockage local
  }
 // Méthode pour rafraîchir le token
 refreshToken(email: string, refreshToken: string): Observable<{token: string}> {
  return this.http.post<{ token: string }>(`${environment.apiUrl}Auth/refresh-token`, { email, refreshToken })

}
}
