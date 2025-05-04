import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, delay, finalize, switchMap, tap, throwError } from 'rxjs';
import { AuthServiceService } from '../../auth-service.service';
import { LoaderService } from '../loader.service';
import { EventServiceService } from '../event-service.service';


// export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
//   const authService = inject(AuthServiceService); 
//   const eventService = inject(EventServiceService);
//   const authToken = sessionStorage.getItem('authToken');
//   const adminObject = sessionStorage.getItem('user');
//   // const refreshToken = sessionStorage.getItem('refreshToken');



//   const admin = JSON.parse(adminObject!)


//   let authReq = req;
//   if (authToken) {
//     authReq = req.clone({
//       headers: req.headers.set('Authorization', `Bearer ${authToken}`)
//     });
//   }
//   // debugger;
//   console.log(authReq, "requettes auth")

//   return next(authReq).pipe(
//     tap(event => {
//       if (event instanceof HttpResponse) {
//         // Vérifiez si l'en-tête `X-Token-Expiring-Soon` est présent dans la réponse
//         const tokenExpiringSoon = event.headers.get('X-Token-Expiring-Soon');
//         console.log("Token expiration soon ::::::::::::::::::", tokenExpiringSoon);
//         if (tokenExpiringSoon) {
//           // Par exemple, afficher un message d'avertissement
//           eventService.show(tokenExpiringSoon);
//         }
//       }
//     }),
//     catchError(error => {
//       if(error.status === 403 || error.status === 401){
//        eventService.show(error.status);
//       }
//       return throwError(() => error);
//     })
  
//   )
 
// };

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthServiceService);
  const eventService = inject(EventServiceService);

  const authToken = authService.getToken();
  const admin = authService.getUser(); // Facilité avec ton service

  let authReq = req;

  if (authToken) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
  }

  return next(authReq).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        const tokenExpiringSoon = event.headers.get('X-Token-Expiring-Soon');
        if (tokenExpiringSoon) {
          eventService.show('⚠️ Votre session expirera bientôt.');
        }
      }
    }),
    catchError(error => {
      if (error.status === 401 || error.status === 403) {
        eventService.show('⛔ Accès refusé ou session expirée.');
        authService.logout(); // Bonne pratique en cas de token expiré ou invalide
      }
      return throwError(() => error);
    })
  );
};


