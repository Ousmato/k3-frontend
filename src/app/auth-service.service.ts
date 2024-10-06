import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Niveau } from './Admin/Models/Niveau';
import { User } from './Admin/Models/Auth';
import { Admin } from './Admin/Models/Admin';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {


  
  private authUrl = 'http://localhost:8080/Auth/login';

  constructor(
    private http : HttpClient
  ) { }


  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.authUrl, { email, password }).pipe(
      
      map(response => {
        // console.log(response, "---------------------------------");
      
      return response;
    }),
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
    // Logique pour vérifier si l'utilisateur a un jeton d'authentification valide
    // Retourne true si l'utilisateur est authentifié, sinon false
    console.log( sessionStorage.getItem('r-scolarite') != null)
    return sessionStorage.getItem('admin') != null || sessionStorage.getItem('der') != null || sessionStorage.getItem('dga') != null || sessionStorage.getItem('dg') != null
     || sessionStorage.getItem('comptable') != null || sessionStorage.getItem('scolarite') != null || sessionStorage.getItem('secretaire') != null; // Exemple : vérifie si un jeton est présent dans le stockage local
  }
}
