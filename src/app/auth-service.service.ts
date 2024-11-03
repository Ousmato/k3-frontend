import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, map, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { Admin } from './Admin/Models/Admin';
import { LoaderService } from './Services/loader.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private authUrl = `${environment.apiUrl}Auth/login`;


  constructor(private http : HttpClient, private loadingService: LoaderService) { }


  login(email: string, password: string): Observable<any> {
    this.loadingService.loading();
    return this.http.post<any>(this.authUrl, { email, password }).pipe(
      
      map(response => {
      // Vérifier si le token existe dans la réponse
      if (response && response.token) {
        // Stocker le token dans le localStorage
        console.log(response, "response")
        sessionStorage.setItem('authToken', response.token);

        // Stocker d'autres détails de l'utilisateur si nécessaire
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


  logout(): Observable<any> {
    // Révoquer le jeton d'authentification ou effectuer d'autres opérations de déconnexion
    return this.http.post<any>(this.authUrl + '/logout', {})
      .pipe(
        map(() => {
          // Suppression du jeton d'authentification du localStorage lors de la déconnexion
          sessionStorage.clear();
          return true; // Vous pouvez retourner toute autre donnée pertinente de la réponse si nécessaire
        })
      );
  }

  // Méthode pour vérifier si l'utilisateur est actuellement authentifié
  isLoggedIn(): boolean {
    console.log( sessionStorage.getItem('user') != null)
    return sessionStorage.getItem('user') != null
    // return sessionStorage.getItem('admin') != null || sessionStorage.getItem('der') != null || sessionStorage.getItem('dga') != null || sessionStorage.getItem('dg') != null
    //  || sessionStorage.getItem('comptable') != null || sessionStorage.getItem('scolarite') != null || sessionStorage.getItem('secretaire') != null; // Exemple : vérifie si un jeton est présent dans le stockage local
  }


  // refresh token
 // Méthode pour rafraîchir le token
refreshToken(email: string): Observable<{token: string}> {
  return this.http.post<{ token: string }>(`${environment.apiUrl}Auth/refresh-token`, { email }).pipe(
    map(response => {
      if (response && response.token) {
        // Mettre à jour le token dans sessionStorage
        sessionStorage.setItem('authToken', response.token);
        console.log("Nouveau token reçu :", response.token);
        return response; // Retourne la réponse pour l'intercepteur
      } else {
        throw new Error("Le token n'a pas été trouvé dans la réponse.");
      }
    }),
    catchError(error => {
      console.error("Erreur lors du rafraîchissement du token :", error);
      return throwError(() => error);
    })
  );
}

  
}
