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
  private readonly USER_KEY = 'user';
  private readonly TOKEN_KEY = 'authToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  roleRouteMap: { [key: string]: string } = {
    SA: '/sidebar',
    DGA: '/dga',
    RS: '/r-scolarite',
    DER: '/der',
    COMPTABLE: '/comptable',
    SP: '/secretaire'
  };

  constructor(private http : HttpClient, private loadingService: LoaderService, private router: Router) { }


  login(email: string, password: string): Observable<any> {
    this.loadingService.loading();
    return this.http.post<any>(this.authUrl, { email, password }).pipe(
      
      map(response => {
      // Vérifier si le token existe dans la réponse
      if (response && response.token) {
        // Stocker le token dans le localStorage
        // console.log(response, "response")
        sessionStorage.setItem(this.TOKEN_KEY, response.token);
        sessionStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
        sessionStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
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


  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  getUser(): any {
    const userJson = sessionStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['']);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      return now >= exp;
    } catch (e) {
      return true;
    }
  }
 
}
